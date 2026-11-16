package benchmarks

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/go-chi/chi/v5"
	"github.com/hainuoli/mino/rest"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/zeromicro/go-zero/rest/pathvar"
	"github.com/zeromicro/go-zero/rest/router"
)

type route struct {
	pattern string
	keys    []string
}

type scenario struct {
	name       string
	routes     []route
	paths      []string
	want       string
	middleware int
	json       bool
}

type framework struct {
	name string
	new  func(scenario) http.Handler
}

var frameworks = []framework{
	{"Mino", newMino},
	{"Gin", newGin},
	{"Chi", newChi},
	{"GoZero", newGoZero},
}

func scenarios() []scenario {
	many := scenario{name: "Routes1000", want: "ok"}
	for i := 0; i < 1000; i++ {
		path := fmt.Sprintf("/resources/r%d/items", i)
		many.routes = append(many.routes, route{pattern: path})
		many.paths = append(many.paths, path)
	}
	return []scenario{
		{name: "Static", routes: []route{{pattern: "/ping"}}, paths: []string{"/ping"}, want: "ok"},
		{name: "Param", routes: []route{{"/users/{id}", []string{"id"}}}, paths: []string{"/users/42"}, want: "42"},
		{name: "MultiParam", routes: []route{{"/orgs/{org}/repos/{repo}/issues/{id}", []string{"org", "repo", "id"}}}, paths: []string{"/orgs/acme/repos/mino/issues/42"}, want: "acme/mino/42"},
		many,
		{name: "Middleware5", routes: []route{{pattern: "/ping"}}, paths: []string{"/ping"}, want: "ok", middleware: 5},
		{name: "JSON", routes: []route{{pattern: "/json"}}, paths: []string{"/json"}, want: "{\"message\":\"hello\",\"id\":42}\n", json: true},
	}
}

// All adapters perform the same response work. Only parameter extraction and
// route registration use each router's native API. No default middleware runs.
func respond(w http.ResponseWriter, values []string, asJSON bool) {
	if asJSON {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
			ID      int    `json:"id"`
		}{"hello", 42})
		return
	}
	if len(values) == 0 {
		_, _ = w.Write([]byte("ok"))
		return
	}
	_, _ = w.Write([]byte(strings.Join(values, "/")))
}

func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Benchmark", "1")
		next.ServeHTTP(w, r)
	})
}

func newMino(s scenario) http.Handler {
	m := rest.NewMux()
	for i := 0; i < s.middleware; i++ {
		m.Use(middleware)
	}
	for _, rt := range s.routes {
		m.Get(rt.pattern, func(w http.ResponseWriter, r *http.Request) {
			values := make([]string, len(rt.keys))
			for i, key := range rt.keys {
				values[i] = r.PathValue(key)
			}
			respond(w, values, s.json)
		})
	}
	return m
}

func colonPattern(pattern string) string {
	return strings.ReplaceAll(strings.ReplaceAll(pattern, "{", ":"), "}", "")
}

func newGin(s scenario) http.Handler {
	gin.SetMode(gin.ReleaseMode)
	m := gin.New()
	for i := 0; i < s.middleware; i++ {
		m.Use(func(c *gin.Context) {
			c.Writer.Header().Set("X-Benchmark", "1")
			c.Next()
		})
	}
	for _, rt := range s.routes {
		m.GET(colonPattern(rt.pattern), func(c *gin.Context) {
			values := make([]string, len(rt.keys))
			for i, key := range rt.keys {
				values[i] = c.Param(key)
			}
			respond(c.Writer, values, s.json)
		})
	}
	return m
}

func newChi(s scenario) http.Handler {
	m := chi.NewRouter()
	for i := 0; i < s.middleware; i++ {
		m.Use(middleware)
	}
	for _, rt := range s.routes {
		m.Get(rt.pattern, func(w http.ResponseWriter, r *http.Request) {
			values := make([]string, len(rt.keys))
			for i, key := range rt.keys {
				values[i] = chi.URLParam(r, key)
			}
			respond(w, values, s.json)
		})
	}
	return m
}

func newGoZero(s scenario) http.Handler {
	m := router.NewRouter()
	for _, rt := range s.routes {
		h := http.Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			values := make([]string, len(rt.keys))
			for i, key := range rt.keys {
				values[i] = pathvar.Vars(r)[key]
			}
			respond(w, values, s.json)
		}))
		for i := 0; i < s.middleware; i++ {
			h = middleware(h)
		}
		if err := m.Handle(http.MethodGet, colonPattern(rt.pattern), h); err != nil {
			panic(err)
		}
	}
	return m
}

func TestAdapters(t *testing.T) {
	for _, tt := range scenarios() {
		t.Run(tt.name, func(t *testing.T) {
			for _, fw := range frameworks {
				t.Run(fw.name, func(t *testing.T) {
					ast := assert.New(t)
					h := fw.new(tt)
					for _, path := range tt.paths {
						w := httptest.NewRecorder()
						h.ServeHTTP(w, httptest.NewRequest(http.MethodGet, path, nil))
						require.Equal(t, http.StatusOK, w.Code, path)
						ast.Equal(tt.want, w.Body.String(), path)
						if tt.middleware > 0 {
							ast.Equal("1", w.Header().Get("X-Benchmark"))
						}
						if tt.json {
							ast.Equal("application/json", w.Header().Get("Content-Type"))
						}
					}
				})
			}
		})
	}
}

// discardWriter retains headers but discards response bytes. The same writer is
// reused for every router; correctness is checked separately with real recorders.
type discardWriter struct{ header http.Header }

func (w *discardWriter) Header() http.Header         { return w.header }
func (w *discardWriter) WriteHeader(int)             {}
func (w *discardWriter) Write(p []byte) (int, error) { return len(p), nil }

func BenchmarkRouter(b *testing.B) {
	for _, s := range scenarios() {
		b.Run(s.name, func(b *testing.B) {
			for _, fw := range frameworks {
				b.Run(fw.name, func(b *testing.B) {
					h := fw.new(s)
					requests := make([]*http.Request, len(s.paths))
					for i, path := range s.paths {
						requests[i] = httptest.NewRequest(http.MethodGet, path, nil)
					}
					w := &discardWriter{header: make(http.Header)}
					b.ReportAllocs()
					b.ResetTimer()
					for i := 0; i < b.N; i++ {
						// A fresh shallow copy prevents PathValue/context state from a
						// previous dispatch being reused. This cost is included for all.
						r := *requests[i%len(requests)]
						h.ServeHTTP(w, &r)
					}
				})
			}
		})
	}
}
