package db

import (
	"context"
	"time"
)

type Blog struct {
	Id        string    `json:"id"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	ImageUrl  string    `json:"cover"`
	CreatedAt time.Time `json:"createdAt"`
	Author    string    `json:"author"`
}

func CreateBlog(blog Blog, author string) error {
	if _, err := CurrConn.Exec(
		context.Background(), "INSERT INTO blog.articles (title, body, image_url, created_at, author)"+
			" VALUES ($1, $2, $3, $4, $5)",
		blog.Title, blog.Body, blog.ImageUrl, time.Now().Format("2006-01-02"), author); err != nil {
		handleError("createView", err)
		return err

	}
	return nil
}
