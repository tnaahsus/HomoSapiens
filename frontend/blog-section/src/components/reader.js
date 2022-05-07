import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ErrorPage from "./Errorpage";
import Loading from "./loading";
import "../style/App.css";
import "../style/toggle.css";
import ShareButtons from "./shareButton";
import { AiFillGithub } from "react-icons/ai";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import ParseGist from "./parseGist";
import Toggle from "./toggle";

const Reader = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [date, setDate] = useState(null);
  const [body, setBody] = useState(null);
  const [githublink, setgithublink] = useState(null);
  const [coffeelink, setcoffeelink] = useState(null);
  const [resumelink, setresumelink] = useState(null);
  const [errorStatus, seterrorStatus] = useState();
  const [errorStatustext, seterrorStatustext] = useState();
  const [error, setError] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const url = typeof window !== "undefined" ? window.location.href : "";

  const addDefaultSrc = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVubnl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";
  };
  useEffect(() => {
    axios
      .get("/api/article/" + id, {
        headers: {
          accept: "application/json",
        },
      })
      .then((resp) => {
        setError(false);
        setBlog(resp.data.blogs[0]);
        let date = new Date(resp.data.blogs[0].createdAt);
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
        setDate(
          `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        );
        let LinkedInUrls = {
          tnaahsus: "sushant-shetty-6b6b8720b/",
          cosmicoppai: "kanak-chaudhari-0863aa183/",
        };
        let a = resp.data.blogs[0].author;
        let b = LinkedInUrls[resp.data.blogs[0].author];
        setgithublink(`https://GitHub.com/${a}`);
        setresumelink(`https://linkedin.com/in/${b}`);
        setcoffeelink(`https://www.buymeacoffee.com/${a}`);
        setBody(<ParseGist body={resp.data.blogs[0].body} />);
      })
      .catch((error) => {
        seterrorStatus(error.response.status);
        seterrorStatustext(error.response.statusText);
        setError(true);
      });
  }, [id]);
  return (
    <div>
      <div className="page">
        <nav className="navbar navbar-expand-lg navigation  nav nav-tabs fixed-top  py-2 ">
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
            <a className="blog-goBack mt-5 pt-4 ms-3" href="/">
              <span> &#8592;</span> <span>Go Back</span>
            </a>
            {blog ? (
              <div className="blog-wrap" id="blog">
                <header className="mt-4  mt-md-2 ">
                  <h1>{blog.title}</h1>
                </header>
                <span className="d-flex justify-content-center mt-2 mt-md-0 ">
                  <ShareButtons
                    url={url}
                    title={blog.title}
                    description={blog.title}
                  />
                </span>
                <div className="singlePostInfo mb-2 mt-3 mt-2">
                  <span>
                    By
                    <b className="singlePostAuthor">
                      <span className="link text-decoration-underline">
                        {blog.author.charAt(0).toUpperCase() +
                          blog.author.slice(1)}
                      </span>
                      <a
                        className="link ms-1"
                        href={githublink}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        <AiFillGithub size="20" />
                      </a>
                      <a
                        className="link ms-1"
                        href={resumelink}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        <TiSocialLinkedinCircular size="24" />
                      </a>
                    </b>
                  </span>
                  <span>{date}</span>
                </div>
                <img
                  width={500}
                  height={400}
                  src={blog.cover}
                  className="mb-4 mt-lg-3 mt-2 "
                  alt="cover"
                  id="Coverimg"
                  onError={addDefaultSrc}
                />
                <span className="blog-desc mt-2   text-break">{body}</span>
                <div id="coffeeSection">
                  If you want to support me: <br />{" "}
                  <a
                    className="bmc-button ms-1"
                    target={"_blank"}
                    rel="noreferrer"
                    href={coffeelink}
                  >
                    <img
                      src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
                      alt="Buy me a coffee"
                    />
                    Buy me a coffee
                  </a>
                </div>
              </div>
            ) : (
              <Loading />
            )}
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
    </div>
  );
};

export default Reader;
