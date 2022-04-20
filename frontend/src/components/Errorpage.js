import React from "react";
import "../style/App.css";

const ErrorPage = (props) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <section className="page_404 ">
        <div className="container position-absolute top-50 start-50 translate-middle ms-2">
          <div className="four_zero_four_bg text-center  my-auto">
            <h1 style={{ fontSize: "100px" }}>{props.error}</h1>
            <h1 className="display-4">{props.errorText} </h1>
            {props.error ? (
              <>
                <h4 className="h4">Looks like you're lost</h4>
                <p>the page you are looking for not avaible!</p>
                <a href="/" className="link_404">
                  Reload
                </a>
              </>
            ) : (
              <>
                <h4 className="h2">404</h4>
                <p>Page Not Found!</p>
                <a href="/" className="link_404">
                  Reload
                </a>
              </>
            )}
          </div>
        </div>
      </section>
      <footer className="container footer px-5 fixed-bottom">
        <p className="float-end">
          <button className="btn border-0 footer" onClick={scrollToTop}>
            <span className="text-primary  border-bottom border-primary">
              Back to top
            </span>
          </button>
        </p>
        <p className="pt-2 footer">© 2020–2021 HomoSapiens.</p>
      </footer>
    </>
  );
};

export default ErrorPage;
