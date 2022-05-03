import React, { useState, useEffect } from "react";
import "../style/App.css";
import "../style/toggle.css";
import axios from "axios";
import ErrorPage from "./Errorpage";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./loading";
import NoResult from "./Noresult";
import Toggle from "./toggle";
import { FiChevronRight } from "react-icons/fi";

const Home = () => {
  const [blogs, setBlogs] = useState("");
  const [query, setQuery] = useState("");
  const [totalCount, settotalCount] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [error, setError] = useState(false);
  const [errorStatus, seterrorStatus] = useState();
  const [errorStatustext, seterrorStatustext] = useState();
  const [loading, setLoading] = useState();
  const [isOpen, setOpen] = useState(false);
  const data = [
    { id: 0, label: "Cosmicoppai", value: "cosmicoppai" },
    { id: 1, label: "Tnaahsus", value: "tnaahsus" },
  ];
  // eslint-disable-next-line no-unused-vars
  const [items, setItem] = useState(data);
  const History = useNavigate();

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (value) => {
    query === value ? authorName(value) : authorName(value);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    let url = window.location.href;
    url = url.split("?").pop();
    const argArray = new URLSearchParams(url);
    let author = argArray.has("author") ? argArray.get("author") : "";
    if (author === "cosmicoppai" || author === "tnaahsus") {
      fetcher();
    } else {
      fetcher();
    }
  }, []);

  const dateCalculator = (e) => {
    let date = new Date(e);
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };
  const fetcher = () => {
    let url = window.location.href;
    url = url.split("?").pop();
    setLoading(true);
    const argArray = new URLSearchParams(url);
    let page = argArray.has("page") ? argArray.get("page") : "";
    if (page === "") {
      page = 1;
    }
    let author = argArray.has("author") ? argArray.get("author") : "";
    let link = "/api/articles?author=" + author + "&page=" + page;

    axios
      .get(link, {
        headers: {
          accept: "application/json",
        },
      })
      .then((resp) => {
        setError(false);
        setLoading(false);
        setBlogs(resp.data.blogs);
        settotalCount(resp.data.total);
        setQuery(author);
        if (resp.data.blogs) {
          document.getElementById("previous").classList.remove("disabled");
          document.getElementById("next").classList.remove("disabled");
          if (!resp.data.isPrev) {
            document.getElementById("previous").classList.add("disabled");
          }
          if (!resp.data.isNext) {
            document.getElementById("next").classList.add("disabled");
          }
        }
      })
      .catch((error) => {
        setError(true);
        seterrorStatus(error.response.status);
        seterrorStatustext(error.response.statusText);
      });
  };
  const title = (t) => {
    return t.length > 40 ? t.slice(0, 40) + "..." : t;
  };
  const authorName = (e) => {
    setQuery(e);
    let url = window.location.href;
    url = url.split("/").pop();
    const params = new URLSearchParams(url);
    let author = params.has("author") ? params.get("author") : "";
    if (e && e !== author) {
      params.delete("author");
      params.delete("page");
      params.append("author", e);
      History({ search: params.toString() });
      fetcher();
    }
  };
  const pageAppender = (e) => {
    let url = window.location.href;
    url = url.split("/").pop();
    const params = new URLSearchParams(url);
    let page = params.has("page") ? params.get("page") : "";
    if (window.location.pathname === "/" && page === "") {
      page = "1";
    }
    if (parseInt(page) !== e.number) {
      params.delete("page");
      params.append("page", e.number);
      History({ search: params.toString() });
      fetcher();
    }
  };
  const nextAppender = () => {
    let url = window.location.href;
    url = url.split("/").pop();
    const argArray = new URLSearchParams(url);
    let page = argArray.has("page") ? argArray.get("page") : "";
    if (page === "") {
      page = 1;
    }
    page = 1 + parseInt(page);
    const params = new URLSearchParams(url);
    if (page) {
      params.delete("page");
      params.append("page", page);
      History({ search: params.toString() });
      fetcher();
    }
  };
  const previousAppender = () => {
    let url = window.location.href;
    url = url.split("/").pop();
    const argArray = new URLSearchParams(url);
    let page = argArray.has("page") ? argArray.get("page") : "";
    page = parseInt(page) - 1;
    const params = new URLSearchParams(url);
    if (page) {
      params.delete("page");
      params.append("page", page);
      History({ search: params.toString() });
      fetcher();
    }
  };
  const pageNumbers = (step = 1) => {
    let i = 1;
    const range = [];

    while (i <= Math.ceil(totalCount / 24)) {
      range.push(i);
      i += step;
    }
    return range;
  };
  const addDefaultSrc = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVubnl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";
  };
  console.log(query);

  return (
    <>
      <div className="page">
        <nav className="navbar navbar-expand-lg navigation nav nav-tabs fixed-top  py-2 ">
          <div className="container-fluid">
            <a className="navbar-brand display-1 fs-4" href="/">
              <span className="fs-3 logo">HomoSapiens</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span id="hamburger">&#9776;</span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
              <form className="d-flex" style={{ marginTop: "-10px" }}>
                <Toggle />
              </form>
            </div>
          </div>
        </nav>
        {error ? (
          <ErrorPage error={errorStatus} errorText={errorStatustext} />
        ) : (
          <>
            <div className="mt-5 pt-5 home">
              <header className="home-header">
                <h1>
                  <span>“</span> Most of us are familiar with the virtues of a
                  programmer. <br />{" "}
                  <span id="space">
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                  </span>
                  There are three, of course: laziness, impatience, and hubris.{" "}
                  <span>”</span>
                </h1>
              </header>
            </div>
            <>
              <div
                className="d-flex mx-auto mt-5 pt-5 mb-3 form"
                id="searchButton"
              >
                <input
                  className="form-control me-2 border border-2"
                  type="search"
                  placeholder="Search Articles on this page"
                  aria-label="Search"
                  id="search"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <div className="dropdown me-2 me-lg-0 border border-2">
                  <div className="dropdown-header" onClick={toggleDropdown}>
                    {items.find((item) => item.value === query)
                      ? items.find((item) => item.value === query).label
                      : "Authors"}
                    <FiChevronRight className={`icon ${isOpen && "open"}`} />
                  </div>
                  <div className={`dropdown-body ${isOpen && "open"}`}>
                    {items.map((item) => (
                      <div
                        className="dropdown-item"
                        key={item.id}
                        onClick={(e) => handleItemClick(item.value)}
                        id={item.id}
                      >
                        <span
                          className={`dropdown-item-dot ${
                            item.value === query && "selected"
                          }`}
                        >
                          •{" "}
                        </span>
                        <span className="dropdown-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {loading ? (
                <Loading />
              ) : (
                <>
                  {blogs ? (
                    <>
                      <div className="container ">
                        <div className="row mb-2">
                          {blogs
                            .filter((post) => {
                              let value;
                              if (searchKey === "") {
                                value = post;
                              } else if (
                                post.title
                                  .toLowerCase()
                                  .includes(searchKey.toLowerCase())
                              ) {
                                value = post;
                              }
                              return value;
                            })
                            .map((blogs) => (
                              <div className="col-md-6" key={blogs.id}>
                                <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative ">
                                  <div className="col p-4 d-flex flex-column position-static">
                                    <h3 className="mb-0">
                                      {title(blogs.title)}
                                    </h3>
                                    <div className="mb-1 text-muted">
                                      {dateCalculator(blogs.createdAt)}
                                    </div>

                                    <Link
                                      className="stretched-link fs-4"
                                      to={`/blog/${blogs.id}`}
                                    >
                                      ➝
                                    </Link>
                                  </div>
                                  <div className="col-auto d-none d-lg-block">
                                    <img
                                      src={blogs.cover}
                                      alt="...."
                                      width="300"
                                      height="250"
                                      onError={addDefaultSrc}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <nav aria-label="Page navigation example ">
                        <ul className="pagination justify-content-center">
                          <li className="page-item  " id="previous">
                            <span
                              className="page-link "
                              id="previousButton"
                              value={"previous"}
                              onClick={() => previousAppender()}
                            >
                              Previous
                            </span>
                          </li>
                          {(pageNumbers() || []).map((number) => (
                            <li className="page-item" key={number} id={number}>
                              <span
                                className="page-link "
                                value={number}
                                onClick={() => pageAppender({ number })}
                              >
                                {number}
                              </span>
                            </li>
                          ))}
                          <li className="page-item" id="next">
                            <span
                              className="page-link"
                              id="nextButton"
                              value={"next"}
                              onClick={() => nextAppender()}
                            >
                              Next
                            </span>
                          </li>
                        </ul>
                      </nav>
                    </>
                  ) : (
                    <NoResult />
                  )}
                </>
              )}
            </>
            <footer className="container mt-3 border-0 border-top">
              <p className="float-end">
                <button className="btn border-0 " onClick={scrollToTop}>
                  <span className="text-primary border-bottom border-primary">
                    Back to top
                  </span>
                </button>
              </p>
              <p className="pt-2">© 2020–2021 HomoSapiens</p>
            </footer>
          </>
        )}
      </div>
    </>
  );
};
export default Home;
