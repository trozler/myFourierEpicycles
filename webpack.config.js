var path = require("path");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    // Write all output files to dist folder. Use path to get pwd.
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
    // publicPath: "/assets/",
  },
  stats: {
    colors: true,
  },
  // Can put to production for better perfomance. i.e. may minimse some code.
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: "babel-loader",
      // },
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"],
      // },
    ],
  },
  // resolve: {
  //   alias: {
  //     DropzoneStyle: path.resolve(
  //       __dirname,
  //       "node_modules/dropzone/dist/min/dropzone.min.css"
  //     ),
  //   },
  // },
};
