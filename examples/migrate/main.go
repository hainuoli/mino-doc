// Command migrate runs the same HTTP service on ServeMux or Mino.
// Select -stdlib for ServeMux, or select Mino's path policies individually.
package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/hainuoli/mino/rest"
)

// Both routers satisfy this local interface. Existing registration helpers can
// depend on the methods they use instead of the concrete *http.ServeMux type.
type routeMux interface {
	http.Handler
	Handle(string, http.Handler)
	HandleFunc(string, func(http.ResponseWriter, *http.Request))
}

func registerRoutes(mux routeMux) {
	mux.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {
		_, _ = fmt.Fprintln(w, r.PathValue("id"))
	})
	mux.HandleFunc("GET /files/{name}", func(w http.ResponseWriter, r *http.Request) {
		_, _ = fmt.Fprintln(w, r.PathValue("name"))
	})
	mux.Handle("GET /docs/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = fmt.Fprintln(w, "docs")
	}))
}

func requestHeader(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Service", "migration-example")
		next.ServeHTTP(w, r)
	})
}

func main() {
	stdlib := flag.Bool("stdlib", false, "use http.ServeMux; path-policy flags apply only to Mino")
	addr := flag.String("addr", ":8080", "HTTP listen address")
	clean := flag.Bool("clean-path", false, "redirect literal dot segments and repeated slashes")
	escaped := flag.Bool("escaped-path", false, "match escaped paths segment by segment")
	slash := flag.Bool("trailing-slash", false, "redirect to a registered trailing-slash route")
	status := flag.Int("redirect-status", http.StatusTemporaryRedirect, "Mino automatic redirect status")
	flag.Parse()

	var mux routeMux
	if *stdlib {
		mux = http.NewServeMux()
	} else {
		mux = rest.NewMuxWithConf(rest.MuxConf{
			CleanPathRedirect:     *clean,
			EscapedPath:           *escaped,
			TrailingSlashRedirect: *slash,
			RedirectStatus:        *status,
		})
	}

	registerRoutes(mux)
	server := &http.Server{
		Addr:              *addr,
		Handler:           requestHeader(mux),
		ReadHeaderTimeout: 5 * time.Second,
	}
	log.Fatal(server.ListenAndServe())
}
