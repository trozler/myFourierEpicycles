const express = require("express");
const compression = require("compression");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(compression());
app.use(express.static(path.join(__dirname, "dist")));

app.listen(PORT);
