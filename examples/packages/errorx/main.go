package main

import (
	"errors"
	"fmt"

	"github.com/hainuoli/mino/core/errorx"
)

func main() {
	notFound := errors.New("user not found")
	err := errorx.Wrapf(notFound, "get user %d", 42)

	fmt.Println(err)
	fmt.Println(errors.Is(err, notFound))
}
