package main

import (
	"context"
	"github.com/tnaahsus/blog-site/db"
	"github.com/tnaahsus/blog-site/settings"
	"log"
	"os"
	"path/filepath"
)

func main() {
	envFile := "./.env"
	configFile := "./config.json"
	args := os.Args
	if len(args) > 2 {
		envFile = args[1]
		configFile = args[2]
	}
	log.Printf("Using %s and %s", envFile, configFile)
	envFilePath, _ := filepath.Abs(envFile)
	settings.LoadEnv(envFilePath)
	settings.InitializeSettings()
	err := db.ConnectDB()
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
	log.Println("Successfully connected with database: ")
	defer db.CurrConn.Close(context.Background())
	db.Initialize(configFile)
	ip := "localhost"
	port := "9000"
	if len(os.Args) == 5 {
		ip = os.Args[4]
		port = os.Args[5]
	}
	HandleHttp(ip, port)
}
