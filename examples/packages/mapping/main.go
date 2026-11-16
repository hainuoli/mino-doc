package main

import (
	"fmt"
	"log"

	"github.com/hainuoli/mino/core/mapping"
)

type Filter struct {
	Page int      `param:"page"`
	Tags []string `param:"tag"`
}

func main() {
	values := map[string][]string{
		"page": {"2"},
		"tag":  {"go", "http"},
	}
	in := Filter{Page: 1}

	err := mapping.Bind(&in, "param", func(name string) []string {
		return values[name]
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(in.Page, in.Tags)
}
