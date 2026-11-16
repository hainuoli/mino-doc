package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/hainuoli/mino/rest/chain"
)

func main() {
	handler := chain.New(serviceHeader).ThenFunc(hello)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func serviceHeader(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Service", "Mino")
		next.ServeHTTP(w, r)
	})
}

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, Mino!")
}
