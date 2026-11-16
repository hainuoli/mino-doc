package main

import (
	"log"
	"net/http"

	"github.com/hainuoli/mino/rest"
	"github.com/hainuoli/mino/rest/httpx"
)

func main() {
	m := rest.NewMux()
	m.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		httpx.OkJSON(w, "ok")
	})
	m.Get("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		var in struct {
			ID int `path:"id" json:"-"`
		}
		if err := httpx.Parse(r, &in); err != nil {
			httpx.Err(w, r, err)
			return
		}
		httpx.OkJSON(w, map[string]int{"id": in.ID})
	})
	log.Fatal(http.ListenAndServe(":8080", m))
}
