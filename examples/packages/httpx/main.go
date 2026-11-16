package main

import (
	"log"
	"net/http"

	"github.com/hainuoli/mino/rest/httpx"
)

type UserRequest struct {
	ID      int  `path:"id" json:"-"`
	Verbose bool `query:"verbose" json:"-"`
}

func (in *UserRequest) Validate() error {
	if in.ID <= 0 {
		return httpx.Errorf(http.StatusBadRequest, "id must be positive")
	}
	return nil
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /users/{id}", getUser)
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func getUser(w http.ResponseWriter, r *http.Request) {
	var in UserRequest
	if err := httpx.Parse(r, &in); err != nil {
		httpx.Err(w, r, err)
		return
	}
	httpx.OkJSONCtx(r.Context(), w, map[string]any{
		"id": in.ID, "verbose": in.Verbose,
	})
}
