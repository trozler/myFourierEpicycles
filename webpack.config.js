var path = require("path");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
  },
  stats: {
    colors: true,
  },
  // optimization: {
  //   nodeEnv: "production",
  //   minimize: true,
  // },
  watch: true,
  watchOptions: {
    aggregateTimeout: 10000,
    ignored: [
      "src/js/imagetracer_v1.2.6.js",
      "node_modules/**",
      "src/js/computedPaths/**",
    ],
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      // {
      //   test: /\.m?js$/,
      //   exclude: /(node_modules|bower_components)/,
      //   loader: "babel-loader",
      // },
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"],
      // },
      // {
      //   test: /\.(png|svg|jpg)$/,
      //   loader: "file-loader",
      //   options: {
      //     name: "[name].[ext]",
      //     outputPath: "images/",
      //   },
      // },
      {
        test: /\.svg$/,
        use: {
          loader: "svg-url-loader",
          options: {
            limit: 40 * 1024,
            name: "[name].[ext]",
            outputPath: "images/",
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      DropzoneMin: path.resolve(__dirname, "node_modules/dropzone/dist/min/"),
    },
  },
};
