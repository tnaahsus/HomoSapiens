package db

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
)

func Initialize(configFile string) {
	_, err := CurrConn.Exec(context.Background(), "CREATE DATABASE IF NOT EXISTS blog;")
	if err != nil {
		log.Fatalln(err)
	}

	_, err = CurrConn.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS blog.authors (name string PRIMARY KEY DEFAULT 'Anon', token string NOT NULL);")
	if err != nil {
		log.Println(err)
	}

	_, err = CurrConn.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS blog.articles (id serial PRIMARY KEY, title string, body string, created_at TIMESTAMPTZ, image_url string, author string NOT NULL REFERENCES blog.authors (name) ON UPDATE CASCADE ON DELETE SET DEFAULT DEFAULT 'Anon', INDEX (author));")
	if err != nil {
		log.Fatalln(err)
	}

	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		log.Fatalln(err)
	}

	type user struct {
		Username string
		Password string
	}

	var users []user

	err = json.Unmarshal(data, &users)
	if err != nil {
		log.Fatalln(err)
	}

	var valueArgs []string

	for _, _user := range users {
		valueArgs = append(valueArgs, fmt.Sprintf("('%s', '%s')", _user.Username, _user.Password))
	}

	stmt := fmt.Sprintf(
		"INSERT INTO blog.authors (name, token) VALUES %s ON CONFLICT (name) DO UPDATE SET token = EXCLUDED.token;",
		strings.Join(valueArgs, ",")) // token can be changed, simply by updating value in config.json

	_, err = CurrConn.Exec(context.Background(), stmt)

	if err != nil {
		log.Fatalln(err)
	}

}
