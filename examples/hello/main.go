package main

import (
	"log"
	"net/http"

	"github.com/hainuoli/mino/rest"
	"github.com/hainuoli/mino/rest/httpx"
)

func main() {
	mux := rest.NewMux()

	mux.Get("/", func(w http.ResponseWriter, r *http.Request) {
		httpx.OkJSON(w, "Hello, Mino!")
	})

	log.Fatal(http.ListenAndServe(":8080", mux))
}
