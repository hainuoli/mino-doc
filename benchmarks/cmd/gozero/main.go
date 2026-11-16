package main

import (
	"log"
	"net/http"

	"github.com/zeromicro/go-zero/rest/pathvar"
	"github.com/zeromicro/go-zero/rest/router"
)

func main() {
	m := router.NewRouter()
	if err := m.Handle(http.MethodGet, "/ping", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})); err != nil {
		log.Fatal(err)
	}
	if err := m.Handle(http.MethodGet, "/users/:id", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(pathvar.Vars(r)["id"]))
	})); err != nil {
		log.Fatal(err)
	}
	log.Fatal(http.ListenAndServe(":8080", m))
}
