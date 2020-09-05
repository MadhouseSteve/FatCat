#!/usr/bin/env node

import Bundler from "parcel-bundler";
import { resolve } from "path";
import { startServer } from "../server/index";

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
    startServer();

    break;
}
