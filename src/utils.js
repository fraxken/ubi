
export function getFuncDecId(node) {
  if (node.id === null || node.id.type !== "Identifier") {
    return null;
  }

  return node.id.name;
}

export function notNullOrUndefined(value) {
  return value !== null && value !== void 0;
}

export function* getIdName(node) {
  switch (node.type) {
    case "Identifier":
      yield node.name;
      break;
    case "RestElement":
      yield node.argument.name;
      break;
    case "AssignmentPattern":
      yield node.left.name;
      break;
    case "ArrayPattern":
      yield* node.elements.filter(notNullOrUndefined).map((id) => [...getIdName(id)]).flat();
      break;
    case "ObjectPattern":
      yield* node.properties.filter(notNullOrUndefined).map((property) => [...getIdName(property)]).flat();
      break;
  }
}

export function* getDeclarationsIdentifiers(declarations) {
  for (const node of declarations) {
    yield* getIdName(node.id);
  }
}
