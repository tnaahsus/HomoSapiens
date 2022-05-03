package db

import (
	"context"
	"errors"
	"log"
)

func Authorize(author string, token string) (error, bool) { // (error, isServerErr[to set diff status code])

	var row int

	err := CurrConn.QueryRow(context.Background(), "SELECT 1 FROM blog.authors WHERE name=$1 AND token=$2;", author, token).Scan(&row)
	if err != nil {
		log.Println("Error While Authorizing: ", err)

		if err.Error() == "no rows in result set" {
			return errors.New("invalid Username or Password"), false
		} else if err.Error() == "conn closed" {
			ReConnectDB()
			return err, true
		}
		return errors.New("try Again After Some Time "), true
	}
	return nil, false
}
