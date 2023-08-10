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

// Transforms any JSX syntax declared elements and adds a radipanId prop if it doesn't already have it
export const addRadipanIdToJsx = (source: string) => {
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
      // Check if the opening element already has a radipanId prop
      const hasRadipanId = openingElement.attributes.some(
        // @ts-ignore
        attr => attr.name && attr.name.name === "radipanId"
      );
      // If not, add a new JSX attribute with a random radipanId value
      if (!hasRadipanId) {
        seqId++;
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

// Transforms any Phy-compatible HyperScript syntax declared elements and adds a radipanId prop if it doesn't already have it
export const addRadipanIdToHyperScript = (source: string) => {
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
        node.arguments.length >= 1
      ) {
        seqId++;
        // Get the first argument of the node, which is the component or tag
        const firstArg = node.arguments[0];
        // Get the second argument of the node, which is the props object or the children array
        const secondArg =
          (node.arguments.length >= 2 && node.arguments[1]) || undefined;
        // Check if there are only one argument
        if (node.arguments.length === 1) {
          // The props and children are omitted
          // Create a new object expression with a radipanId property
          const radipanId = `${seqId}-${genRandomId(seqId)}`;
          const objectProperty = t.objectProperty(
            t.identifier("radipanId"),
            t.stringLiteral(radipanId)
          );
          const objectExpression = t.objectExpression([objectProperty]);
          // Insert the object expression as the second argument of the node
          node.arguments.push(objectExpression);
        } else if (secondArg && t.isObjectExpression(secondArg)) {
          // The second argument is the props object
          // Check if the props object already has a radipanId property
          const hasRadipanId = secondArg.properties.some(
            prop =>
              t.isObjectProperty(prop) &&
              t.isIdentifier(prop.key) &&
              prop.key.name === "radipanId"
          );
          // If not, add a new object property with a random radipanId value
          if (!hasRadipanId) {
            const radipanId = `${seqId}-${genRandomId(seqId)}`;
            const objectProperty = t.objectProperty(
              t.identifier("radipanId"),
              t.stringLiteral(radipanId)
            );
            secondArg.properties.push(objectProperty);
          }
        } else if (secondArg && t.isArrayExpression(secondArg)) {
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
        } else if (
          !secondArg ||
          (t.isIdentifier(secondArg) && secondArg.name === "undefined")
        ) {
          // The second argument is undefined or omitted
          // Create a new object expression with a radipanId property
          const radipanId = `${seqId}-${genRandomId(seqId)}`;
          const objectProperty = t.objectProperty(
            t.identifier("radipanId"),
            t.stringLiteral(radipanId)
          );
          const objectExpression = t.objectExpression([objectProperty]);
          // Insert the object expression as the second argument of the node
          node.arguments.push(objectExpression);
        } else if (t.isStringLiteral(secondArg)) {
          // The second argument is a string literal, which means it is a single child element
          // Create a new object expression with a radipanId property
          const radipanId = `${seqId}-${genRandomId(seqId)}`;
          const objectProperty = t.objectProperty(
            t.identifier("radipanId"),
            t.stringLiteral(radipanId)
          );
          const objectExpression = t.objectExpression([objectProperty]);
          // Insert the object expression as the second argument of the node and move the original second argument to the third position
          node.arguments.splice(1, 0, objectExpression);
        }
      }
    },
  });

  // Generate the transformed code from the AST
  const { code } = generate(ast);
  return code;
};

// Transforms any Radipan Syntax declared element and adds a radipanId prop if it doesn't already have it
export const addRadipanIdToRadipanSyntax = (source: string) => {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  // Traverse the AST and transform it
  traverse(ast, {
    // Visit every call expression node
    CallExpression(path) {
      seqId++;
      // Get the node from the path
      const node = path.node;
      // Check if the node is a Radipan Syntax declared element
      if (
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object) &&
        t.isIdentifier(node.callee.property) &&
        node.callee.property.name === "create" &&
        Array.isArray(node.arguments)
      ) {
        // Check if there are no arguments
        if (node.arguments.length === 0) {
          // The props and children are omitted
          // Create a new object expression with a radipanId property
          const radipanId = `${seqId}-${genRandomId(seqId)}`;
          const objectProperty = t.objectProperty(
            t.identifier("radipanId"),
            t.stringLiteral(radipanId)
          );
          const objectExpression = t.objectExpression([objectProperty]);
          // Insert the object expression as the first argument of the node
          node.arguments.push(objectExpression);
        } else {
          // Get the first argument of the node, which is the props object or the children argument
          const firstArg = node.arguments[0];
          // Get the second argument of the node, which is the children array
          const secondArg = node.arguments[1];
          // Check if there are only one argument and it is not an object expression
          if (node.arguments.length === 1 && !t.isObjectExpression(firstArg)) {
            // The props are omitted, and the first argument is the children argument
            // Create a new object expression with a radipanId property
            const radipanId = `${seqId}-${genRandomId(seqId)}`;
            const objectProperty = t.objectProperty(
              t.identifier("radipanId"),
              t.stringLiteral(radipanId)
            );
            const objectExpression = t.objectExpression([objectProperty]);
            // Insert the object expression as the first argument of the node and move the original first argument to the second position
            node.arguments.unshift(objectExpression);
          } else if (t.isObjectExpression(firstArg)) {
            // The first argument is the props object
            // Check if there are two arguments and the second argument is an array expression or a string literal
            if (
              node.arguments.length === 2 &&
              (t.isArrayExpression(secondArg) || t.isStringLiteral(secondArg))
            ) {
              // The second argument is the children array or a single child element
              // Check if the props object already has a radipanId property
              const hasRadipanId = firstArg.properties.some(
                prop =>
                  t.isObjectProperty(prop) &&
                  t.isIdentifier(prop.key) &&
                  prop.key.name === "radipanId"
              );
              // If not, add a new object property with a random radipanId value
              if (!hasRadipanId) {
                const radipanId = `${seqId}-${genRandomId(seqId)}`;
                const objectProperty = t.objectProperty(
                  t.identifier("radipanId"),
                  t.stringLiteral(radipanId)
                );
                firstArg.properties.push(objectProperty);
              }
            } else {
              // The children are omitted, and only the props object is provided
              // Check if the props object already has a radipanId property
              const hasRadipanId = firstArg.properties.some(
                prop =>
                  t.isObjectProperty(prop) &&
                  t.isIdentifier(prop.key) &&
                  prop.key.name === "radipanId"
              );
              // If not, add a new object property with a random radipanId value
              if (!hasRadipanId) {
                const radipanId = `${seqId}-${genRandomId(seqId)}`;
                const objectProperty = t.objectProperty(
                  t.identifier("radipanId"),
                  t.stringLiteral(radipanId)
                );
                firstArg.properties.push(objectProperty);
              }
            }
          }
        }
      }
    },
  });

  // Generate the transformed code from the AST
  const { code } = generate(ast);
  return code;
};

export const preformat = (code: string) => {
  return addRadipanIdToRadipanSyntax(
    addRadipanIdToHyperScript(addRadipanIdToJsx(code))
  );
};
