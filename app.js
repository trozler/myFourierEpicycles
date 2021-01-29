const express = require("express");
const compression = require("compression");
// const helmet = require("helmet");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8000;

// app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, "dist")));

app.listen(PORT);
