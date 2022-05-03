import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import ParseGist from "./ParseGist";

const App = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [title, settitle] = useState("");
  const [body, setbody] = useState("");
  const [parsebody, setparsebody] = useState("");
  const [cover, setcover] = useState("");
  const [date, setDate] = useState("");
  const [error, seterror] = useState("");
  const [usernameerror, setusernameerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [titleerror, settitleerror] = useState("");
  const [bodyerror, setbodyerror] = useState("");
  const [covererror, setcovererror] = useState("");
  const [value, setValue] = useState(false);
  const addDefaultSrc = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVubnl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";
  };

  let button =
    usernameerror === false &&
    passworderror === false &&
    bodyerror === false &&
    titleerror === false &&
    covererror === false;
  const redirect = (e) => {
    e.preventDefault();
    checkImage(cover);
    let date = new Date();
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
    setparsebody(<ParseGist body={body} />);
    document.getElementById("preview").style.display = "block";
    document.getElementById("admin").style.display = "none";
  };
  const back = (e) => {
    e.preventDefault();
    setDate("");
    document.getElementById("preview").style.display = "none";
    document.getElementById("admin").style.display = "block";
  };
  const Username = (e) => {
    setusername(e.target.value);
    if (e.target.value === "") {
      setusernameerror(true);
    } else {
      setusernameerror(false);
    }
  };
  const Password = (e) => {
    setpassword(e.target.value);
    if (e.target.value === "") {
      setpassworderror(true);
    } else {
      setpassworderror(false);
    }
  };

  const Title = (e) => {
    settitle(e.target.value);
    if (e.target.value === "") {
      settitleerror(true);
    } else {
      settitleerror(false);
    }
  };
  const Body = (e) => {
    setbody(e.target.value);
    if (e.target.value === "") {
      setbodyerror(true);
    } else {
      setbodyerror(false);
    }
  };
  function checkImage(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function () {
      if (request.status === 200) {
      } else {
        setcover("");
        alert("Image Url is Invalid!");
      }
    };
  }
  const Cover = (e) => {
    setcover(e.target.value);
    if (e.target.value === "") {
      setcovererror(true);
    } else {
      setcovererror(false);
    }
  };
  const Signup = async (e) => {
    e.preventDefault();
    let auth = "Basic " + btoa(username + ":" + password);
    await axios
      .post(
        value
          ? "https://blogs.pbl.asia/api/add/article"
          : "http://localhost:9000/api/add/article",
        {
          title: title,
          body: body,
          cover: cover,
        },
        {
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        seterror("");
        setbody("");
        settitle("");
        setcover("");
        alert("Blog added successfully");
      })
      .catch((error) => {
        seterror(error.response.data);
      });
  };

  return (
    <>
      <div className="container" id="admin">
        <header className="headerSection">
          <div className="headeName text-center">
            <h2>HomoSapiens</h2>
          </div>
          <div className="headerContainer text-center pt-2">
            <div className="toggle-switch">
              <input
                checked={value}
                onChange={() => setValue(!value)}
                type="checkbox"
                className="checkbox"
                name="label"
                id="labelClass"
              />
              <label className="label" htmlFor="labelClass">
                <span className="inner" />
                <span className="switch" />
              </label>
            </div>
          </div>
        </header>
        <main>
          <div className="row g-5">
            <div className="">
              <h4 className="mb-3">Admin Panel</h4>
              <form className="row g-3 needs-validation" noValidate>
                <div className="col-md-6">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => Username(e)}
                    id="username"
                  />
                  {usernameerror && (
                    <div style={{ color: "red" }}>Username is required!</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputPassword4" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => Password(e)}
                    id="inputPassword4"
                  />
                  {passworderror && (
                    <div style={{ color: "red" }}>Password is required!</div>
                  )}
                </div>
                <div className="col-12">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => Title(e)}
                    id="title"
                  />
                  {titleerror && (
                    <div style={{ color: "red" }}>Title is required!</div>
                  )}
                </div>
                <div className="col-12">
                  <label htmlFor="body" className="form-label">
                    Body
                  </label>
                  <textarea
                    className="form-control"
                    id="body"
                    value={body}
                    onChange={(e) => Body(e)}
                  ></textarea>
                  {bodyerror && (
                    <div style={{ color: "red" }}>Body is required!</div>
                  )}
                </div>
                <div className="col-12 mb-2">
                  <label htmlFor="cover" className="form-label">
                    Cover Image
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={cover}
                    onChange={(e) => Cover(e)}
                    id="cover"
                  />
                  {covererror && (
                    <div style={{ color: "red" }}>Cover is required!</div>
                  )}
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-outline-primary me-2"
                    onClick={redirect}
                  >
                    Preview
                  </button>
                  {!button && (
                    <button type="submit" className="btn btn-primary" disabled>
                      Publish
                    </button>
                  )}
                  {button && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={Signup}
                    >
                      Publish
                    </button>
                  )}
                </div>
                <span className="mt-2 text-danger h4">{error}</span>
              </form>
            </div>
          </div>
        </main>

        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p className="mb-1">© HomoSapiens.com</p>
        </footer>
      </div>

      <div id="preview" style={{ display: "none" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light  nav nav-tabs fixed-top  py-2 ">
          <div className="container-fluid">
            <a className="navbar-brand display-1 fs-4" href="/">
              <span className="fs-3">HomoSapiens</span>
            </a>
          </div>
        </nav>
        <p
          className="blog-goBack mt-5 pt-4 ms-3"
          onClick={back}
          style={{ cursor: "pointer" }}
        >
          <span> &#8592;</span> <span>Go Back</span>
        </p>
        <div className="blog-wrap" id="blog">
          <header className="mt-4  mt-md-2 ">
            <h1>{title}</h1>
          </header>
          <span className="d-flex justify-content-center mt-2 mt-md-0 "></span>
          <div className="singlePostInfo mb-2 mt-3 mt-2">
            <span>
              By
              <b className="singlePostAuthor">
                <span className="link text-decoration-underline">
                  {username.charAt(0).toUpperCase() + username.slice(1)}
                </span>
              </b>
            </span>
            <span>{date}</span>
          </div>
          <img
            width={600}
            height={500}
            src={cover}
            className="mb-4 mt-lg-3 mt-2 "
            alt="cover"
            id="Coverimg"
            onError={addDefaultSrc}
          />
          <span className="blog-desc mt-2   text-break">{parsebody}</span>
        </div>
        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p className="mb-1">© HomoSapiens.com</p>
        </footer>
      </div>
    </>
  );
};

export default App;
