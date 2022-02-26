#!/usr/bin/env node

// Import Third-party Dependencies
import sade from "sade";

// Import Internal Dependencies
import { analyzeDir } from "../src/index.js";

console.log("");
const cli = sade("ubi")
  .describe("Ubiquitous seeker")
  .version("1.0.0");

cli
  .command("cwd")
  .describe("Search of identifiers in current working dir")
  .action(() => {
    analyzeDir(process.cwd());
  });

cli.parse(process.argv);
