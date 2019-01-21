/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { withAuth } from "@okta/okta-react";
import React, { Component } from "react";
import { Button, Header } from "semantic-ui-react";
import { checkAuthentication } from "./helpers";
import JobInputForm from "./components/JobInputForm";

export default withAuth(
  class Home extends Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: null, userinfo: null };
      this.checkAuthentication = checkAuthentication.bind(this);
      this.login = this.login.bind(this);
    }

    async componentDidMount() {
      this.checkAuthentication();
    }

    async componentDidUpdate() {
      this.checkAuthentication();
    }

    async login() {
      this.props.auth.login("/");
    }

    render() {
      return (
        <div>
          {this.state.authenticated !== null && (
            <div>
              {this.state.authenticated && <JobInputForm />}
              {!this.state.authenticated && (
                <div style={{ marginTop: "7em" }}>
                  <Header as="h1">Cost Benchmark Tool</Header>
                  <p>
                    This application is currently under development and
                    restricted to a select group of users for testing.
                  </p>

                  <Button
                    className="btn btn-primary"
                    id="login-button"
                    primary
                    onClick={this.login}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  }
);
