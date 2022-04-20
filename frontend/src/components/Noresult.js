import React, { useState, useEffect } from "react";
import "../style/App.css";
import imageToRender from "../noResult.png";

const NoResult = () => {
  const [mobileTable, setmobileTablet] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 600) {
      setmobileTablet(true);
    } else {
      setmobileTablet(false);
    }
  }, []);
  return (
    <div>
      {mobileTable ? (
        <div className="img">
          <img
            width="100%"
            height="500"
            className="d-block mx-auto  "
            style={{ cursor: "none" }}
            src={imageToRender}
            alt=""
          />
        </div>
      ) : (
        <div className="img">
          <img
            width="400"
            height="300"
            className="d-block mx-auto mt-5"
            style={{ cursor: "none" }}
            src={imageToRender}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default NoResult;
