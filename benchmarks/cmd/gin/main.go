package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	m := gin.New()
	m.GET("/ping", func(c *gin.Context) {
		_, _ = c.Writer.Write([]byte("ok"))
	})
	m.GET("/users/:id", func(c *gin.Context) {
		_, _ = c.Writer.Write([]byte(c.Param("id")))
	})
	log.Fatal(http.ListenAndServe(":8080", m))
}
