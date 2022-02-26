/* eslint-disable id-length */
// Import Node.js Dependencies
import path from "path";
import { existsSync } from "fs";

// Import Third-party Dependencies
import { walkSync } from "@nodesecure/fs-walk";
import FrequencySet from "frequency-set";

// Import Internal Dependencies
import * as AST from "./ast.js";

// CONSTANTS
const kExcludeWords = [
  "__importDefault",
  "__createBinding",
  "__setModuleDefault",
  "__importStar",
  "__exportStar",
  "constructor",
  "k",
  "p",
  "mod",
  "queryRunner",
  "where",
  "isSensibleData",
  "isMandatory",
  "includeRateLimit",
  "startQueryRunner"
];

export function analyzeDir(location = process.cwd()) {
  const jsFiles = [...walkSync(location)]
    .filter(([dirent]) => dirent.isFile() && path.extname(dirent.name) === ".js")
    .map(([, absoluteFileLocation]) => absoluteFileLocation);

  const uniqueIdentifiers = new FrequencySet();
  for (const fileLocation of jsFiles) {
    const identifiers = AST.scanFile(fileLocation);
    identifiers.forEach((value) => uniqueIdentifiers.add(value));
  }

  kExcludeWords.forEach((word) => uniqueIdentifiers.delete(word));

  const entries = uniqueIdentifiers.toJSON().sort((a, b) => b[1] - a[1]);
  console.log(Object.fromEntries(entries));
}
