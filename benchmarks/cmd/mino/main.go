package main

import (
	"log"
	"net/http"

	"github.com/hainuoli/mino/rest"
)

func main() {
	m := rest.NewMux()
	m.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})
	m.Get("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(r.PathValue("id")))
	})
	log.Fatal(http.ListenAndServe(":8080", m))
}
