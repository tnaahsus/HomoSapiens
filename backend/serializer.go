package main

import (
	"encoding/json"
	"github.com/tnaahsus/blog-site/db"
	"log"
)

var paginateBy = 24

type paginator struct {
	Blogs  []db.Blog `json:"blogs"`
	IsNext bool      `json:"isNext"`
	IsPrev bool      `json:"isPrev"`
	Total  int       `json:"total"`
}

func paginate(blogs []db.Blog, page int) paginator {
	totalRes := len(blogs)
	paginatedRes := paginator{Total: totalRes}
	totalNoOfPages := totalRes / paginateBy

	if page < 0 || page > totalNoOfPages { // page 0 & 1 will result into first page; page less than 1 will result into last page
		page = totalNoOfPages
	} else if page > 0 {
		page = page - 1
	}
	startLimit := paginateBy * page
	if startLimit > totalRes {
		startLimit = 0
	}
	endLimit := startLimit + paginateBy
	if endLimit > totalRes {
		endLimit = totalRes
	}
	if page >= 1 {
		paginatedRes.IsPrev = true
	} else {
		paginatedRes.IsPrev = false
	}
	if page < totalNoOfPages {
		paginatedRes.IsNext = true
	} else {
		paginatedRes.IsNext = false
	}
	paginatedRes.Blogs = blogs[startLimit:endLimit]

	return paginatedRes

}

func serialize(blogs []db.Blog, page int) (error, []byte) {
	paginatedRes := paginate(blogs, page)
	serializedResult, err := json.Marshal(paginatedRes)
	if err != nil {
		log.Println(err)
		return err, []byte{}
	}

	return nil, serializedResult

}
