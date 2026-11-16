package main

import (
	"fmt"
	"log"

	"github.com/hainuoli/mino/core/jsonx"
)

type User struct {
	Name string `json:"name"`
}

func main() {
	data, err := jsonx.Marshal(User{Name: "Mino"})
	if err != nil {
		log.Fatal(err)
	}

	var user User
	if err := jsonx.Unmarshal(data, &user); err != nil {
		log.Fatal(err)
	}
	fmt.Println(user.Name)
}
