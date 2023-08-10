import * as t from "@babel/types";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { outdir } from "../../cli/get-config";
import { cx } from "../../cli/get-design-system";
import { writeFileSync, readFileSync } from "fs";

const process = (typeof global !== "undefined" && global?.process) || {
  env: { DEBUG: false, fileLock: "", CSSGEN_FILE: "" },
};
const DEBUG = process?.env?.DEBUG;
const TRANSPILED_FILES = new Map();

process.env.fileLock = "";

export function transform(
  source: string,
  radipanId: string,
  className: string,
  variantProps?: Record<string, any>
) {
  const resultJsx = transformJsx(source, radipanId, className, variantProps);
  if (resultJsx === source) {
    const resultHs = transformHyperScript(
      source,
      radipanId,
      className,
      variantProps
    );
    if (resultHs === source) {
      const resultRadipan = transformRadipanSyntax(
        source,
        radipanId,
        className,
        variantProps
      );
      return resultRadipan;
    }
    return resultHs;
  }
  return resultJsx;
}

export function transformJsx(
  source: string,
  radipanId: string,
  className: string,
  variantProps?: Record<string, any>
) {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  // Initialize a flag to indicate if a match is found
  let matchFound = false;

  // Traverse the AST and transform it
  traverse(ast, {
    JSXElement(path) {
      // Get the opening element of the JSX element
      const openingElement = path.node.openingElement;
      // Check if the opening element has a radipanId attribute
      const radipanIdAttr = openingElement.attributes.find(
        // @ts-ignore
        attr => attr.name && attr.name.name === "radipanId"
      );
      // @ts-ignore
      if (radipanIdAttr && radipanIdAttr.value.value === radipanId) {
        // If the radipanId attribute matches the given radipanId parameter
        // Set the flag to true
        matchFound = true;
        // Remove `radipanId` prop
        openingElement.attributes = openingElement.attributes.filter(
          attr => attr !== radipanIdAttr
        );
        // Add the compiled className
        openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("className"),
            t.stringLiteral(className)
          )
        );
        // Remove any css prop in the element
        openingElement.attributes = openingElement.attributes.filter(
          // @ts-ignore
          attr => !(attr.name && attr.name.name === "css")
        );
        // Remove any prop that is in the keys of the variantProps parameter
        if (variantProps) {
          openingElement.attributes = openingElement.attributes.filter(
            attr =>
              // @ts-ignore
              !(attr.name && Object.keys(variantProps).includes(attr.name.name))
          );
        }
        // Stop the traversal after finding the match
        path.stop();
      }
    },
  });

  // If a match is found, generate the transformed code from the AST
  if (matchFound) {
    const { code } = generate(ast);
    return code;
  } else {
    // Otherwise, return the source code directly
    return source;
  }
}

export function transformHyperScript(
  source: string,
  radipanId: string,
  className: string,
  variantProps?: Record<string, any>
) {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  // Initialize a flag to indicate if a match is found
  let matchFound = false;

  // Traverse the AST and transform it
  traverse(ast, {
    CallExpression(path) {
      // Check if the call expression is a HyperScript call
      if (
        // @ts-ignore
        path.node.callee.name === "h" &&
        path.node.arguments.length >= 1 &&
        t.isStringLiteral(path.node.arguments[0])
      ) {
        // Get the tag name and the props object of the HyperScript call
        // const tagName = path.node.arguments[0].value;
        const props = path.node.arguments[1];
        // Check if the props object is an object expression, undefined, or ommited
        if (t.isObjectExpression(props) || t.isIdentifier(props) || !props) {
          // @ts-ignore
          const radipanIdProp = props?.properties.find(
            // Check if the props object has a radipanId property
            (prop: t.ObjectProperty | t.SpreadElement) =>
              t.isObjectProperty(prop) &&
              t.isIdentifier(prop.key) &&
              prop.key.name === "radipanId"
          );
          // If the radipanId property matches the given radipanId parameter
          if (
            radipanIdProp &&
            t.isObjectProperty(radipanIdProp) &&
            t.isStringLiteral(radipanIdProp.value) &&
            radipanIdProp.value.value === radipanId
          ) {
            // Set the flag to true
            matchFound = true;
            // @ts-ignore
            props.properties = props.properties.filter(
              // Replace the radipanId property with a className property
              (prop: t.ObjectProperty | t.SpreadElement) =>
                prop !== radipanIdProp
            );
            // @ts-ignore
            props.properties.push(
              t.objectProperty(
                t.identifier("className"),
                t.stringLiteral(className)
              )
            );
            // @ts-ignore
            props.properties = props.properties.filter(
              // Remove any css prop in the object
              (prop: t.ObjectProperty | t.SpreadElement) =>
                !(
                  t.isObjectProperty(prop) &&
                  t.isIdentifier(prop.key) &&
                  prop.key.name === "css"
                )
            );
            // Remove any prop that is in the keys of the variantProps parameter
            if (variantProps) {
              // @ts-ignore
              props.properties = props.properties.filter(
                (prop: t.ObjectProperty | t.SpreadElement) =>
                  !(
                    t.isObjectProperty(prop) &&
                    t.isIdentifier(prop.key) &&
                    Object.keys(variantProps).includes(prop.key.name)
                  )
              );
            }
            // Stop the traversal after finding the match
            path.stop();
          }
        }
      }
    },
  });

  // If a match is found, generate the transformed code from the AST
  if (matchFound) {
    const { code } = generate(ast);
    return code;
  } else {
    // Otherwise, return the source code directly
    return source;
  }
}

// Transforms any Radipan Syntax declared element and converts it into a HyperScript element with a className prop
export function transformRadipanSyntax(
  source: string,
  radipanId: string,
  className: string,
  variantProps?: Record<string, any>
) {
  // Parse the source code into an AST
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  // Initialize a flag to indicate if a match is found
  let matchFound = false;

  // Traverse the AST and transform it
  traverse(ast, {
    CallExpression(path) {
      // Check if the call expression is a Radipan Syntax call
      if (
        t.isMemberExpression(path.node.callee) &&
        t.isIdentifier(path.node.callee.object) &&
        t.isIdentifier(path.node.callee.property) &&
        path.node.callee.property.name === "create" &&
        Array.isArray(path.node.arguments)
      ) {
        // Get the first argument of the node, which is the props object or the children argument
        const firstArg = path.node.arguments[0];
        // Get the second argument of the node, which is the children array or undefined
        const secondArg = path.node.arguments[1];
        // Check if there are no arguments
        if (path.node.arguments.length === 0) {
          // The props and children are omitted
          // Do nothing
        } else if (
          // Check if there are only one argument and it is an object expression
          path.node.arguments.length === 1 &&
          t.isObjectExpression(firstArg)
        ) {
          // The props are provided, but not the children
          // Check if the props object has a radipanId property that matches the given radipanId parameter
          const radipanIdProp = firstArg.properties.find(
            prop =>
              t.isObjectProperty(prop) &&
              t.isIdentifier(prop.key) &&
              prop.key.name === "radipanId" &&
              t.isStringLiteral(prop.value) &&
              prop.value.value === radipanId
          );
          // If a match is found
          if (radipanIdProp) {
            // Set the flag to true
            matchFound = true;
            // Replace the radipanId property with a className property with the given className parameter
            // @ts-ignore
            radipanIdProp.key.name = "className";
            // @ts-ignore
            radipanIdProp.value.value = className;
            // Remove any css prop in the props object
            firstArg.properties = firstArg.properties.filter(
              prop =>
                !(
                  t.isObjectProperty(prop) &&
                  t.isIdentifier(prop.key) &&
                  prop.key.name === "css"
                )
            );
            // Remove any prop that is in the keys of the variantProps parameter
            if (variantProps) {
              firstArg.properties = firstArg.properties.filter(
                prop =>
                  !(
                    t.isObjectProperty(prop) &&
                    t.isIdentifier(prop.key) &&
                    Object.keys(variantProps).includes(prop.key.name)
                  )
              );
            }
            // Stop the traversal after finding the match
            path.stop();
          }
        } else if (
          // Check if there are two arguments and both are object expressions
          path.node.arguments.length === 2 &&
          t.isObjectExpression(firstArg) &&
          t.isObjectExpression(secondArg)
        ) {
          // The props and children are both provided as object expressions
          // This is not a valid Radipan Syntax, so do nothing
        } else if (
          // Check if there are two arguments and the first one is an object expression and the second one is an array expression or a string literal
          path.node.arguments.length === 2 &&
          t.isObjectExpression(firstArg) &&
          (t.isArrayExpression(secondArg) || t.isStringLiteral(secondArg))
        ) {
          // The props and children are both provided
          // Check if the props object has a radipanId property that matches the given radipanId parameter
          const radipanIdProp = firstArg.properties.find(
            prop =>
              t.isObjectProperty(prop) &&
              t.isIdentifier(prop.key) &&
              prop.key.name === "radipanId" &&
              t.isStringLiteral(prop.value) &&
              prop.value.value === radipanId
          );
          // If a match is found
          if (radipanIdProp) {
            // Set the flag to true
            matchFound = true;
            // Replace the radipanId property with a className property with the given className parameter
            // @ts-ignore
            radipanIdProp.key.name = "className";
            // @ts-ignore
            radipanIdProp.value.value = className;
            // Remove any css prop in the props object
            firstArg.properties = firstArg.properties.filter(
              prop =>
                !(
                  t.isObjectProperty(prop) &&
                  t.isIdentifier(prop.key) &&
                  prop.key.name === "css"
                )
            );
            // Remove any prop that is in the keys of the variantProps parameter
            if (variantProps) {
              firstArg.properties = firstArg.properties.filter(
                prop =>
                  !(
                    t.isObjectProperty(prop) &&
                    t.isIdentifier(prop.key) &&
                    Object.keys(variantProps).includes(prop.key.name)
                  )
              );
            }
            // Stop the traversal after finding the match
            path.stop();
          }
        } else if (
          // Check if there are only one argument and it is not an object expression
          path.node.arguments.length === 1 &&
          !t.isObjectExpression(firstArg)
        ) {
          // The props are omitted, and the first argument is the children argument
          // Create a new object expression with a className property with the given className parameter
          const classNameProp = t.objectProperty(
            t.identifier("className"),
            t.stringLiteral(className)
          );
          const propsObject = t.objectExpression([classNameProp]);
          // Insert the props object as the first argument of the node and move the original first argument to the second position
          path.node.arguments.unshift(propsObject);
        }
      }
    },
  });

  // If a match is found, generate the transformed code from the AST
  if (matchFound) {
    const { code } = generate(ast);
    return code;
  } else {
    // Otherwise, return the source code directly
    return source;
  }
}

export const transpile = async (
  radipanId: string,
  classesStr: string,
  variantProps?: Record<string, any>
) => {
  const EXPORT_FOLDER = `node_modules/${outdir}/exported`;
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  while (process.env.fileLock !== "") {
    await new Promise(() => {});
  }
  process.env.fileLock = transpileFileName;
  const src =
    (TRANSPILED_FILES.has(transpileFileName) &&
      TRANSPILED_FILES.get(transpileFileName)) ||
    readFileSync(transpileFileName, "utf-8");

  try {
    const code = transform(src, radipanId, classesStr, variantProps);
    if (code === src) {
      process.env.fileLock = "";
      return false;
    }
    TRANSPILED_FILES.set(transpileFileName, code);
    writeFileSync(transpileFileName, code);
    DEBUG &&
      console.debug(
        "Transpiled component successfully: ",
        transpileFileName,
        code
      );
    process.env.fileLock = "";

    return true;
  } catch (error) {
    DEBUG && console.error(error);
    return false;
  } finally {
    process.env.fileLock = "";
  }
};
