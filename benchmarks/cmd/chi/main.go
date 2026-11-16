package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {
	m := chi.NewRouter()
	m.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})
	m.Get("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(chi.URLParam(r, "id")))
	})
	log.Fatal(http.ListenAndServe(":8080", m))
}
