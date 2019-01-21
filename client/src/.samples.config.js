export default {
  oidc: {
    clientId: "0oai7ovrxez92Sq5g0h7",
    issuer: "https://dev-198596.oktapreview.com/oauth2/default",
    devRedirectUri: "http://localhost:8080/implicit/callback",
    prodRedirectUri:
      "https://costbenchmarksbx.apps.cl2.graybar.com/implicit/callback",
    scope: "openid profile email"
  },
  resourceServer: {
    messagesUrl: "http://localhost:8000/api/messages"
  }
};
