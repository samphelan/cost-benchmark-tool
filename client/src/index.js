import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import JobInputForm from "./components/JobInputForm";
import ReportError from "./components/ReportError";
import { Security, SecureRoute, ImplicitCallback } from "@okta/okta-react";
import UserPage from "./components/UserPage";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";

const config = {
  issuer: "https://dev-198596.oktapreview.com",
  redirect_uri: window.location.origin + "/implicit/callback",
  client_id: "0oai7ovrxez92Sq5g0h7"
};

const App = () => {
  return (
    <BrowserRouter>
      <Security
        issuer={config.issuer}
        client_id={config.client_id}
        redirect_uri={config.redirect_uri}
      >
        <SecureRoute exact path="/" render={() => <JobInputForm />} />
        <Route path="/implicit/callback" component={ImplicitCallback} />
        <SecureRoute path="/report-error" component={ReportError} />
        <SecureRoute path="/user" render={() => <UserPage />} />
      </Security>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
