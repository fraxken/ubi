// Import Node.js Dependencies
import { readFileSync } from "fs";

// Import Third-party Dependencies
import { walk } from "estree-walker";
import * as meriyah from "meriyah";

// Import Internal Dependencies
import { getFuncDecId, getDeclarationsIdentifiers } from "./utils.js";

export function scanFile(location) {
  const str = readFileSync(location, "utf-8");

  // Note: if the file start with a shebang then we remove it because 'parseScript' may fail to parse it.
  // Example: #!/usr/bin/env node
  const strToAnalyze = str.charAt(0) === "#" ? str.slice(str.indexOf("\n")) : str;
  const { body } = meriyah.parseScript(strToAnalyze, {
    next: true, loc: true, raw: true, module: true
  });

  const listOfIdentiers = [];

  walk(body, {
    enter(node) {
      // Skip the root of the AST.
      if (Array.isArray(node)) {
        return;
      }

      if (node.type === "FunctionDeclaration") {
        const id = getFuncDecId(node);
        if (id !== null) {
          listOfIdentiers.push(id);
        }
      }
      else if (node.type === "VariableDeclaration") {
        const lIdentifiers = [...getDeclarationsIdentifiers(node.declarations)]
          .filter((id) => !id.includes("_1"));

        listOfIdentiers.push(...lIdentifiers);
      }
      else if (node.type === "ClassDeclaration") {
        listOfIdentiers.push(node.id.name);
      }
      else if (node.type === "FieldDefinition" && node.key.type === "Identifier") {
        listOfIdentiers.push(node.key.name);
      }
      else if (node.type === "MethodDefinition") {
        listOfIdentiers.push(node.key.name);
      }
      else if (node.type === "ObjectExpression") {
        for (const property of node.properties) {
          if (property.type !== "Property" || property.key.type !== "Identifier") {
            continue;
          }

          listOfIdentiers.push(property.key.name);
        }
      }
    }
  });

  return listOfIdentiers;
}
