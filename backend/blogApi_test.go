// tests files are not build by compiler when we run go build command, so we don't need to worry about them ending up in deployment

package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"strconv"
	"testing"
	"time"
)

var (
	authors     = map[string]struct{}{"test": {}}
	blogIds     []int
	totalBlogs  = 26
	_paginateBy = paginateBy
)

func TestListView(t *testing.T) {
	_CreateBlog(t)

	_testListView(t, 0, "")
	_testListView(t, -1, "")
	_testListView(t, 2, "")
	_testListView(t, 0, "test")
	_testListView(t, 0, "nichijou")

}

func TestAPIDetailView(t *testing.T) {
	for _, id := range blogIds {

		reqUrl := fmt.Sprintf("http://localhost:9000/api/article/%d", id)
		response, err := http.Get(reqUrl)

		if err != nil {
			handleError(t, err.Error())
		}

		if status := response.StatusCode; status != http.StatusOK {
			handleError(t, fmt.Sprintf("/api/article return wrong status code: %v", status))
		}

		jsonResp := _readBody(t, response.Body)

		if jsonResp.Total != 1 {
			handleError(t, fmt.Sprintf("Invalid Response: %s, response contain invalid no blogs", reqUrl))
		}

		rId, _ := strconv.Atoi(jsonResp.Blogs[0].Id)
		rBody := jsonResp.Blogs[0].Body
		if rId != id && rBody != "" {
			t.Fatal(fmt.Sprintf("Invalid Response: Expected Blog with id %d, but received %d and body %s", id, rId, rBody))
		}
		_ = response.Body.Close()
	}
}

func TestApiPagination(t *testing.T) {
	_reqURl := "http://localhost:9000/api/articles?page=%d"
	for page := 1; page < int(math.Ceil(float64(len(blogIds))/float64(_paginateBy))); page++ {
		reqURL := fmt.Sprintf(_reqURl, page)
		response, err := http.Get(reqURL)
		if err != nil {
			handleError(t, fmt.Sprintf("Error in TestPagination: %s", err.Error()))
		}
		if response.StatusCode != http.StatusOK {
			handleError(t, fmt.Sprintf("%s return wrong status code: %v", reqURL, response.StatusCode))
		}

		jsonResp := _readBody(t, response.Body)
		b := page * _paginateBy
		var expectedNoOfBlogs int
		if len(blogIds) < b {
			expectedNoOfBlogs = len(blogIds[b-_paginateBy:])
		} else {
			expectedNoOfBlogs = _paginateBy
		}
		receivedNoOfBlogs := len(jsonResp.Blogs)
		if receivedNoOfBlogs != expectedNoOfBlogs {
			handleError(t, fmt.Sprintf("Error in TestPagination: Wrong no of blogs, expected %d, received %d", expectedNoOfBlogs, receivedNoOfBlogs))
		}

	}

}

func _CreateBlog(t *testing.T) {
	auth := "Basic " + base64.StdEncoding.EncodeToString([]byte("test:1234567"))
	client := http.Client{
		Timeout: 5 * time.Second,
	}
	for i := 0; i < totalBlogs; i++ {
		blog := _createDummyBlog(t)
		req, err := http.NewRequest(http.MethodPost, "http://localhost:9000/api/add/article", bytes.NewBuffer(blog))
		if err != nil {
			handleError(t, "Error during forming request for /api/add/article")
		}
		req.Header.Add("authorization", auth)
		req.Header.Add("Content-Type", "application/json")
		req.Header.Add("Access-Control-Allow-Credentials", "true")

		resp, err := client.Do(req)

		if err != nil {
			handleError(t, fmt.Sprintf("Error while making request to /add/article: %s", err.Error()))
		}

		if resp.StatusCode != http.StatusCreated {
			handleError(t, fmt.Sprintf("/api/add/article return wrong status code: %v", resp.StatusCode))
		}
		_ = resp.Body.Close()
	}

}

func _testListView(t *testing.T, page int, author string) {
	reqUrl := fmt.Sprintf("http://localhost:9000/api/articles?author=%s&page=%d", author, page)
	response, err := http.Get(reqUrl)
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(response.Body)

	if err != nil {
		handleError(t, err.Error())
	}

	if status := response.StatusCode; status != http.StatusOK {
		handleError(t, fmt.Sprintf("/api/blogs return wrong status code: %v", status))
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		handleError(t, err.Error())
	}
	var jsonResp paginator
	err = json.Unmarshal(body, &jsonResp)
	if err != nil {
		handleError(t, "Error during unMarshalling the response")
	}
	if jsonResp.Total == 0 {
		if _, prs := authors[author]; author != "" && prs { // if requested author present
			handleError(t, fmt.Sprintf("Invalid Response: %s, response contain no blogs", reqUrl))
		}
	}
	if len(blogIds) == 0 {
		for _, blog := range jsonResp.Blogs {
			id, _ := strconv.Atoi(blog.Id)
			blogIds = append(blogIds, id)
		}
	}
}

func handleError(t *testing.T, err string) {
	t.Fatal(err)
}

func _createDummyBlog(t *testing.T) []byte {
	blog, err := json.Marshal(map[string]string{
		"title": genRandomData(15),
		"body":  genRandomData(1000),
		"cover": "https://" + genRandomData(5),
	})
	if err != nil {
		t.Fatal("Error while creating dummy blog")
	}
	return blog
}

func genRandomData(length int) string {
	str := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ1234567890@#$/<>*"
	b := make([]byte, length)
	for i := range b {
		b[i] = str[rand.Intn(len(str))]
	}
	return string(b)
}

func _readBody(t *testing.T, _body io.Reader) paginator {
	body, err := ioutil.ReadAll(_body)
	if err != nil {
		handleError(t, err.Error())
	}
	var jsonResp paginator
	err = json.Unmarshal(body, &jsonResp)
	if err != nil {
		handleError(t, "Error during unMarshalling the response")
	}
	return jsonResp

}
