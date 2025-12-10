const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, 'tsconfig.json'));

module.exports = {
  output: {
    uniqueName: "shell",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      library: { type: "var", name: "shell" },
      remotes: {
        "authMf": "authMf@http://localhost:4201/remoteEntry.js",
        "feedMf": "feedMf@http://localhost:4202/remoteEntry.js",
        "profileMf": "profileMf@http://localhost:4203/remoteEntry.js",
        "chatMf": "chatMf@http://localhost:4204/remoteEntry.js",
        "notificationsMf": "notificationsMf@http://localhost:4205/remoteEntry.js"
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: "^18.0.0" },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: "^18.0.0" },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: "^18.0.0" },
        "@angular/material": { singleton: true, strictVersion: false },
        "rxjs": { singleton: true, strictVersion: false },
        ...sharedMappings.getDescriptors()
      }
    }),
    sharedMappings.getPlugin()
  ]
};
