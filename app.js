const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8000;

// Sets all of the defaults, but overrides script-src and img-src
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": [
        "'self'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js",
        "'sha256-pg6E7r7f+MmnpjPzMTqTwzVsdojufrjoZf1g6y+Hr4k='",
        "'sha256-zSJwuGpR4olqvnUlDqJMUEEFpOMFfbZgc4pgAIphISs='",
      ],
      "connect-src": ["'self'", "https://www.google-analytics.com"],
      "img-src": ["'self'", "data:", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
    },
  })
);
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(compression());
app.use(express.static(path.join(__dirname, "dist")));

app.listen(PORT, () => console.log("Listening on port:", PORT));
