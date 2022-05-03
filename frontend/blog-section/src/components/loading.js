import React, { useState, useEffect } from "react";

const Loading = () => {
  const [mobileTable, setmobileTablet] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 600) {
      setmobileTablet(true);
    } else {
      setmobileTablet(false);
    }
  }, []);
  let mystyle = {
    width: "3rem",
    height: "3rem",
    cursor: "pointer",
  };
  return (
    <div>
      {mobileTable && (
        <div
          className="spinner-border d-block mx-auto"
          style={mystyle}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!mobileTable && (
        <div
          className="spinner-border d-block mx-auto"
          style={mystyle}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Loading;
