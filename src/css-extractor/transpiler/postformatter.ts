import * as t from "@babel/types";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

export const removeRadipanIdFromJsx = (source: string) => {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  // Traverse the AST and transform it
  traverse(ast, {
    // Visit every JSX element node
    JSXElement(path) {
      // Get the opening element of the JSX element
      const openingElement = path.node.openingElement;
      // Filter out the radipanId prop from the attributes array
      openingElement.attributes = openingElement.attributes.filter(
        // @ts-ignore
        attr => attr.name && attr.name.name !== "radipanId"
      );
    },
  });

  // Generate the transformed code from the AST
  const { code } = generate(ast);
  return code;
};

export const removeRadipanIdFromHyperScript = (source: string) => {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  // Traverse the AST and transform it
  traverse(ast, {
    // Visit every call expression node
    CallExpression(path) {
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
          // Filter out the radipanId property from the properties array
          secondArg.properties = secondArg.properties.filter(
            // @ts-ignore
            prop => prop.key && prop.key.name !== "radipanId"
          );
        } else if (t.isArrayExpression(secondArg)) {
          // The second argument is the children array
          // Remove the second argument of the node, which is the radipanId object expression
          node.arguments.splice(1, 1);
        }
      }
    },
  });

  // Generate the transformed code from the AST
  const { code } = generate(ast);
  return code;
};

export const postformat = (code: string) => {
  return removeRadipanIdFromJsx(code);
};
