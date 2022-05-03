package db

import (
	"context"
	"github.com/jackc/pgtype"
	"strconv"
)

func GetBlog(id int) (error, []Blog) {
	contx, cancel := context.WithTimeout(context.Background(), timeLimit)
	defer cancel()
	var (
		_id       int
		title     string
		body      string
		imageUrl  string
		createdAt pgtype.Timestamptz
		author    string
	)
	var res []Blog
	err := CurrConn.QueryRow(contx, "SELECT * FROM blog.articles WHERE ID=$1;", id).Scan(&_id, &title, &body, &createdAt, &imageUrl, &author)
	if err != nil {
		handleError("DetailView", err)
		return err, res
	}
	res = append(res, Blog{Id: strconv.Itoa(_id), Title: title, Body: body, ImageUrl: imageUrl, CreatedAt: createdAt.Time, Author: author})
	return nil, res
}
