import "./main.css";
import React from "react";

export default function BrowserWindow(props) {
  // Straight out of w3schools: https://www.w3schools.com/howto/howto_css_browser_window.asp

  const url = props.url || "http://localhost:3000";

  return (
    <div className="browser container">
      <div className="row">
        <div className="column left">
        <span className="dot" style={{background: "#ED594A"}}></span>
        <span className="dot" style={{background: "#FDD800"}}></span>
        <span className="dot" style={{background: "#5AC05A"}}></span>
        </div>
        <div className="column middle">
          <input type="text" value={url} />
        </div>
        <div className="column right">
          <div style={{float: "right"}}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>

      <div className="content">
        {props.children}
      </div>
    </div>
  )
}