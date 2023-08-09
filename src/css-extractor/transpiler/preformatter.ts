import * as t from "@babel/types";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

const idLength = 7;
let seqId = 10;

const genRandomId = (seqNum: number) =>
  Number(
    Math.random() +
      (((((((((seqNum / 2) * 3) / 5) * 7) / 11) * 13) / 17) * 23) / 29) * 31 +
      0.000000000101010101010101010101
  )
    .toString(35)
    .slice(-idLength)
    .toUpperCase();

// Define a type guard function that checks if the attribute is a JSX attribute with a name property
function isJSXAttributeWithName(
  attr: t.Node
): attr is t.JSXAttribute & { name: t.JSXIdentifier } {
  return t.isJSXAttribute(attr) && attr.name && t.isJSXIdentifier(attr.name);
}

export const addRadipanIdToJsx = (source: string) => {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  // Traverse the AST and transform it
  traverse(ast, {
    // Visit every JSX element node
    JSXElement(path) {
      seqId++;
      // Get the opening element of the JSX element
      const openingElement = path.node.openingElement;
      // Check if the opening element already has a radipanId prop
      const hasRadipanId = openingElement.attributes.some(
        attr => isJSXAttributeWithName(attr) && attr.name.name === "radipanId"
      );
      // If not, add a new JSX attribute with a random radipanId value
      if (!hasRadipanId) {
        const radipanId = `${seqId}-${genRandomId(seqId)}`;
        const jsxAttribute = t.jsxAttribute(
          t.jsxIdentifier("radipanId"),
          t.stringLiteral(radipanId)
        );
        openingElement.attributes.push(jsxAttribute);
      }
    },
  });

  // Generate the transformed code from the AST
  const { code } = generate(ast);
  return code;
};

// Define a function that transforms any Phy-compatible HyperScript syntax declared elements and adds a radipanId prop if it doesn't already have it
export const addRadipanIdToHyperScript = (source: string) => {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  // Traverse the AST and transform it
  traverse(ast, {
    // Visit every call expression node
    CallExpression(path) {
      seqId++;
      // Get the node from the path
      const node = path.node;
      // Check if the node is a Phy-compatible HyperScript syntax declared element
      if (
        t.isIdentifier(node.callee) &&
        node.callee.name === "h" &&
        Array.isArray(node.arguments) &&
        node.arguments.length >= 2
      ) {
        // Get the second argument of the node, which is the props object or the children array
        const secondArg = node.arguments[1];
        // Check if the second argument is an object expression
        if (t.isObjectExpression(secondArg)) {
          // The second argument is the props object
          // Check if the props object already has a radipanId property
          const hasRadipanId = secondArg.hasOwnProperty("radipanId");
          // If not, add a new object property with a random radipanId value
          if (!hasRadipanId) {
            const radipanId = `${seqId}-${genRandomId(seqId)}`;
            const objectProperty = t.objectProperty(
              t.identifier("radipanId"),
              t.stringLiteral(radipanId)
            );
            secondArg.properties.push(objectProperty);
          }
        } else if (t.isArrayExpression(secondArg)) {
          // The second argument is the children array
          // Create a new object expression with a radipanId property
          const radipanId = `${seqId}-${genRandomId(seqId)}`;
          const objectProperty = t.objectProperty(
            t.identifier("radipanId"),
            t.stringLiteral(radipanId)
          );
          const objectExpression = t.objectExpression([objectProperty]);
          // Insert the object expression as the second argument of the node
          node.arguments.splice(1, 0, objectExpression);
        }
      }
    },
  });

  // Generate the transformed code from the AST
  const { code } = generate(ast);
  return code;
};

export const preformat = (code: string) => {
  return addRadipanIdToHyperScript(addRadipanIdToJsx(code));
};
