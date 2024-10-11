package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)
//golang
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
	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		fmt.Fprint(w, INDEX)
	})

	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}
