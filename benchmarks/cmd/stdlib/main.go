package main

import (
	"log"
	"net/http"
)

func main() {
	m := http.NewServeMux()
	m.HandleFunc("GET /ping", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})
	m.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(r.PathValue("id")))
	})
	log.Fatal(http.ListenAndServe(":8080", m))
}
