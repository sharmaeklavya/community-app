import React from "react";

function LoadSvg() {
  return (
    <div className="row vh-100 align-items-center">
      <div className="col-md-12">
        <img
          className="m-auto p-2"
          src="/loader.svg"
          alt="page-loading"
          style={{ height: "200px" }}
        />
        <p className="body-text p-2 text-center">
          Please wait while we fulfill your request...
        </p>
      </div>
    </div>
  );
}

export default LoadSvg;
