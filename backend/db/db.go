package db

import (
	"context"
	"github.com/jackc/pgx/v4"
	"github.com/tnaahsus/blog-site/settings"
	"log"
	"os"
	"sync"
	"time"
)

var (
	CurrConn *pgx.Conn

	lock = &sync.Mutex{}

	timeLimit = 15 * time.Second
)

func ConnectDB() error {
	config, err := pgx.ParseConfig(os.ExpandEnv(settings.ConnectionConfig))
	if err != nil {
		log.Println("error configuring the database: ", err)
		return err
	}
	conn, err := pgx.ConnectConfig(context.Background(), config)
	if err != nil {
		log.Println("error connecting to the database: ", err)
		return err
	}
	CurrConn = conn
	return nil
}

func ReConnectDB() {
	err := CurrConn.Ping(context.Background()) // ping the db to check connection
	if err != nil {
		lock.Lock()
		defer lock.Unlock()
		err = CurrConn.Ping(context.Background()) // ping again, in-case multiple threads bypass the first check
		if err != nil {
			connected := false
			log.Println("Connection lost with db, ReConnecting...")
			for !connected {
				log.Println("ReConnecting with DataBase...")
				if err = ConnectDB(); err == nil {
					connected = true
				}
			}
			log.Println("ReConnected Successfully")
		}
	}
}

func handleError(view string, err error) {
	log.Printf("Error while querying the database in %s: \n", view)
	log.Println(err)
	if err.Error() == "conn closed" {
		ReConnectDB()
	}
}
