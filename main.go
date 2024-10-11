package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

const INDEX = `<!DOCTYPE html>
<html>
  <head>
    <title>Initaliz-Buildpack Securepack</title>
  </head>
  <body>
    <img style="display: block; margin-left: auto; margin-right: auto; width: 50%;" src="https://nkspknddghh.s3.ap-south-1.amazonaws.com/securepacks.png"></img>
  </body>
</html>`

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		fmt.Fprintln(w, INDEX)
	})
//MainGo
	log.Fatal(http.ListenAndServe(":8080", router))
}
