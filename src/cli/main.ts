#!/usr/bin/env node

import Bundler from "parcel-bundler";
import { resolve } from "path";
import { readFileSync } from "fs";
import nodemon from "nodemon";
import * as ts from "typescript";

const entryFiles = resolve(__dirname, "../client/index.html");

switch (process.argv[2].toLowerCase()) {
  case "dev":
    (async function () {
      // Initializes a bundler using the entrypoint location and options provided
      const bundler = new Bundler(entryFiles, { watch: true });

      // Run the bundler, this returns the main bundle
      // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
      await bundler.bundle();
    })();

    nodemon({
      script: resolve(__dirname, "../server/index.js"),
      exec: "ts-node",
      ext: "ts",
    });
    // nodemon --watch src --exec ts-node node_modules/.bin/

    break;

  // TODO - make this work ... TSC is being a pain
  case "build":
    (async function () {
      // Initializes a bundler using the entrypoint location and options provided
      const bundler = new Bundler(entryFiles, { watch: false });

      // Run the bundler, this returns the main bundle
      // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
      await bundler.bundle();
    })();
    const tsConfigPath = resolve(__dirname, "../../../../", "tsconfig.json");
    const configFileText = readFileSync(tsConfigPath).toString();
    const result = ts.parseConfigFileTextToJson(
      "tsconfig.json",
      configFileText
    );
    const configObject = result.config;

    ts.createProgram(configObject);

  case "start":
    require("../server/index.js");
}
