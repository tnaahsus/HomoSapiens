package db

import (
	"context"
	"github.com/jackc/pgtype"
	"github.com/jackc/pgx/v4"
	"strconv"
)

func iterateRows(rows pgx.Rows) (error, []Blog) {
	defer rows.Close()
	var result []Blog
	var (
		id        int
		title     string
		imageUrl  string
		createdAt pgtype.Timestamptz
		author    string
	)
	for rows.Next() {
		err := rows.Scan(&id, &title, &imageUrl, &createdAt, &author)
		if err != nil {
			handleError("iterateRows", err)
			return err, []Blog{}
		}
		result = append(result, Blog{Id: strconv.Itoa(id), Title: title, ImageUrl: imageUrl, CreatedAt: createdAt.Time, Author: author})
	}
	return nil, result

}
func GetAll() (error, []Blog) {
	contx, cancel := context.WithTimeout(context.Background(), timeLimit)
	defer cancel()
	rows, err := CurrConn.Query(contx, "SELECT id, title, image_url, created_at, author FROM blog.articles ORDER BY created_at DESC;")
	if err != nil {
		handleError("GetAll", err)
		return err, []Blog{}
	}
	return iterateRows(rows)
}

func GetAllByAuthor(author string) (error, []Blog) {
	contx, cancel := context.WithTimeout(context.Background(), timeLimit)
	defer cancel()
	rows, err := CurrConn.Query(contx, "SELECT id, title, image_url, created_at, author FROM blog.articles WHERE author=$1 ORDER BY created_at DESC;", author)
	if err != nil {
		handleError("GetAllByAuthor", err)
		return err, []Blog{}
	}
	return iterateRows(rows)

}
