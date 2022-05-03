package main

import (
	"encoding/base64"
	"encoding/json"
	"github.com/tnaahsus/blog-site/db"
	"github.com/tnaahsus/blog-site/settings"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func HandleHttp(ip string, port string) {
	server := http.NewServeMux()
	server.HandleFunc("/api/articles", BlogList)
	server.HandleFunc("/api/article/", BlogDetail)
	server.HandleFunc("/api/add/article", CreateBlog)
	log.Printf("HTTP Server listening on %s \n", ip+":"+port)
	log.Fatalln(http.ListenAndServe(ip+":"+port, server))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", settings.Host)
	(*w).Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")
	(*w).WriteHeader(http.StatusOK)
}

func BlogList(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received %s request: %s ", r.Method, r.RequestURI)
	if r.Method == http.MethodGet {
		pageInUrl := r.URL.Query().Get("page")
		author := r.URL.Query().Get("author")
		var page int
		_page, err := strconv.Atoi(pageInUrl) // if page doesn't exist or there is an error in converting the string("1") to int(1), set page to 1
		if err != nil {
			log.Printf("Error in setting the pageValue(%s) to int: %s", pageInUrl, err.Error())
			page = 1
		} else {
			page = _page
		}

		var result []db.Blog // declare the result type

		if author != "" {
			err, result = db.GetAllByAuthor(author)
		} else {
			err, result = db.GetAll() // get the result from database
		}
		if err != nil {
			if err.Error() == "no rows in result set" {
				w.WriteHeader(http.StatusNotFound)
			} else {
				w.WriteHeader(http.StatusInternalServerError)
			}
		}
		err, serializedResult := serialize(result, page)
		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(serializedResult)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func BlogDetail(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received %s request: %s ", r.Method, r.RequestURI)
	if r.Method == http.MethodGet {
		id, err := strconv.Atoi(strings.TrimPrefix(r.URL.Path, "/api/article/"))
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		err, result := db.GetBlog(id)
		if err != nil {
			if err.Error() == "no rows in result set" {
				w.WriteHeader(http.StatusNotFound)
				return
			}
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		err, serializedResult := serialize(result, 1)
		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(serializedResult)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func CreateBlog(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received %s request[CreateBlog]:  %s", r.Method, r.RequestURI)
	if r.Method == http.MethodOptions {
		enableCors(&w)
		return
	}

	if r.Method == http.MethodPost {
		cred := r.Header.Get("Authorization")
		if cred != "" && strings.HasPrefix(cred, "Basic ") {
			cred = strings.TrimPrefix(cred, "Basic ")
			_decodedCred, err := base64.StdEncoding.DecodeString(cred)
			if err != nil {
				log.Println("Error in Decoding: ", err)
				http.Error(w, "Invalid Authorization Header", http.StatusUnauthorized)
				return
			}
			decodedCred := string(_decodedCred)
			seperatorIndex := strings.Index(decodedCred, ":")
			author, token := strings.ToLower(decodedCred[:seperatorIndex]), decodedCred[seperatorIndex+1:]
			err, isServerErr := db.Authorize(author, token)
			if err != nil {
				if isServerErr {
					w.WriteHeader(http.StatusInternalServerError)
				} else {
					w.WriteHeader(http.StatusUnauthorized)
				}
				_, _ = w.Write([]byte(err.Error()))
				return
			}
			var blog db.Blog
			if err := json.NewDecoder(r.Body).Decode(&blog); err != nil || (blog.Title == "" && blog.Body == "" && blog.ImageUrl == "") { // check for errors and if all required fields are present
				http.Error(w, "Make sure all fields are present and JSON is in correct format", http.StatusBadRequest)
				return
			}
			if err = db.CreateBlog(blog, author); err != nil {
				http.Error(w, "Try Again Later", http.StatusInternalServerError)
				return
			}
			(w).Header().Set("Access-Control-Allow-Origin", settings.Host) // set allowed-origin as header
			w.WriteHeader(http.StatusCreated)
			_, _ = w.Write([]byte("Blog Added Successfully"))
		} else {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
