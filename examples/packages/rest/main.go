package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/hainuoli/mino/rest"
)

func main() {
	mux := rest.NewMux()
	mux.Get("/hello/{name}", hello)
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, %s!", r.PathValue("name"))
}
