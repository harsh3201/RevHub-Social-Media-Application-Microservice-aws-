const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "profileMf",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "profileMf",
      filename: "remoteEntry.js",
      exposes: {
        './routes': './src/app/app.routes.ts'
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: "^18.0.0" },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: "^18.0.0" },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: "^18.0.0" },
        "@angular/material": { singleton: true, strictVersion: false },
        "rxjs": { singleton: true, strictVersion: false }
      }
    })
  ]
};
