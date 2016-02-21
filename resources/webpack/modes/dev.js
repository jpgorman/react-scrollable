module.exports = (function(baseConfig) {
  var config = Object.create(baseConfig);
  var webpack = require("webpack");

  var oldPlugins = config.plugins || [];

  config.plugins = oldPlugins.concat([
    new webpack.DefinePlugin({
      MODE: "(window.MODE || 'DEV')",
      BUILD_DATE: JSON.stringify(new Date()),
      "process.env": {
        NODE_ENV: JSON.stringify("dev"),
        REST_URL: JSON.stringify(process.env.REST_URL)
      }
    })
  ]);

  return config;

})(require("../base"))
