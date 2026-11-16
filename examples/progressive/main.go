package main

import (
	"log"
	"net/http"

	"github.com/hainuoli/mino/rest"
	"github.com/hainuoli/mino/rest/httpx"
)

type userRequest struct {
	ID      int  `path:"id" json:"-"`
	Verbose bool `query:"verbose" json:"-"`
}

func (in *userRequest) Validate() error {
	if in.ID <= 0 {
		return httpx.Errorf(http.StatusBadRequest, "id must be positive")
	}
	return nil
}

// getUser also works unchanged with http.NewServeMux:
// mux.HandleFunc("GET /users/{id}", getUser).
func getUser(w http.ResponseWriter, r *http.Request) {
	var in userRequest
	if err := httpx.Parse(r, &in); err != nil {
		httpx.Err(w, r, err)
		return
	}
	httpx.OkJSONCtx(r.Context(), w, map[string]any{
		"id": in.ID, "verbose": in.Verbose,
	})
}

func requestHeader(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Service", "mino")
		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := rest.NewMux()
	mux.Use(requestHeader)
	api := mux.Route("/api")
	api.Get("/users/{id}", getUser)
	log.Fatal(http.ListenAndServe(":8080", mux))
}
