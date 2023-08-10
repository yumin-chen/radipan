import {
  transform,
  transformJsx,
  transformHyperScript,
  transformRadipanSyntax,
  transpile,
} from "./transpiler";
import {
  describe,
  beforeEach,
  afterEach,
  expect,
  jest,
  it,
} from "@jest/globals";
import { readFileSync } from "fs";
import mock from "mock-fs";

jest.mock("../../cli/get-config", () => ({
  __esModule: true,
  outdir: "test_out_dir",
}));

describe("transpiler", () => {
  describe("transform", () => {
    it("should return the transformed code mixed with all styles", () => {
      const src = `
    import React from "react";
    import { p } from "radipan/tags";
    
    function App() {
      return (
        <div>
          <h1 radipanId="uniq-test">Hello World</h1>
          { paragraph }
          { button }
        </div>
      );
    };
    
    const paragraph = p.create({
      anotherProp: "heavy",
      radipanId: "another-uniq-id",
    }, "This is a paragraph");

    const button = h("button", { radipanId: "btn" });
`;

      // Call the function with the sample inputs
      const output1 = transform(src, "uniq-test", "specific-class");
      const output2 = transform(
        output1,
        "another-uniq-id",
        "another-classes and-more"
      );
      const output3 = transform(output2, "btn", "more styling classes");

      // Expect the output to match the expected output
      expect(output1).toMatchSnapshot();
      expect(output2).toMatchSnapshot();
      expect(output3).toMatchSnapshot();
    });
  });

  describe("transformJsx", () => {
    it("should find the identified radipanId from a nested JSX element and transform it", () => {
      const input = `
      <div radipanId="2-def">
        <h1 radipanId="3-ghi">Title</h1>
        <p radipanId="4-jkl">Content</p>
      </div>
    `;
      const output = `<div radipanId="2-def">
        <h1 className="some-class">Title</h1>
        <p radipanId="4-jkl">Content</p>
      </div>;`;
      expect(transformJsx(input, "3-ghi", "some-class")).toBe(output);
    });

    it("should remove any css prop in the element when found the radipanId match", () => {
      const input = `
      <div css={{ color: "red"}} radipanId="asdf">Test</div>
    `;
      const output = `<div className="new-classes">Test</div>;`;
      expect(transformJsx(input, "asdf", "new-classes")).toBe(output);
    });

    it("should remove any prop that is in the keys of the variantProps parameter", () => {
      const input = `
      <div variant="solid" radipanId="asdf">Test</div>
    `;
      const output = `<div className="another-class">Test</div>;`;
      expect(
        transformJsx(input, "asdf", "another-class", { variant: "solid" })
      ).toBe(output);
    });

    it("should return the source code directly if no match of radipanId is found", () => {
      const input = `
      <div variant="solid" radipanId="asdf">Test</div>
    `;
      expect(transformJsx(input, "zxcv", "new-class")).toBe(input);
    });
  });

  describe("transformHyperScript", () => {
    it("should find the identified radipanId from a nested HyperScript call and transform it", () => {
      const input = `
      h("div", { radipanId: "2-def" }, [
        h("h1", { radipanId: "3-ghi" }, "Title"),
        h("p", { radipanId: "4-jkl", css: { color: "red" } }, "Content"),
      ])
    `;

      const output1 = transformHyperScript(input, "3-ghi", "qwerqwer");
      const output2 = transformHyperScript(
        output1,
        "4-jkl",
        "another classes string"
      );
      const output3 = transformHyperScript(output2, "2-def", "poiupoiu");

      expect(output1).toMatchSnapshot();
      expect(output2).toMatchSnapshot();
      expect(output3).toMatchSnapshot();
    });

    it("should remove any css prop in the object when found the radipanId match", () => {
      const input = `
      h("div", { css: { color: "red" }, radipanId: "asdf" }, "Test")
    `;
      const output = `h("div", {
  className: "new-class"
}, "Test");`;
      expect(transformHyperScript(input, "asdf", "new-class")).toBe(output);
    });

    it("should remove any prop that is in the keys of the variantProps parameter", () => {
      const input = `
      h("div", { variant: "solid", radipanId: "zxcv" }, "Test")
    `;
      const output = `h("div", {
  className: "class names"
}, "Test");`;
      expect(
        transformHyperScript(input, "zxcv", "class names", { variant: "solid" })
      ).toBe(output);
    });

    it("should return the source code directly if no match of radipanId is found, even if the props object is ommited", () => {
      const input = `h("div", [h(App)])`;
      expect(transformHyperScript(input, "asdf", "new-class")).toBe(input);
    });
  });

  describe("transformRadipanSyntax", () => {
    it("should transform a Radipan Syntax element with props and children", () => {
      const source = `
      import { div, main } from "radipan/tags";
      function App() {
        return main.create({
          css: {
            width: "100%",
            height: "100vh",
            color: { base: "black" },
            background: { base: "white" }
          },
          radipanId: "11-UF7JEX2"
        }, div.create({
          className: "fs_2xl font_bold"
        }, "Hello Radip🐼n!"));
      }`;
      const radipanId = "11-UF7JEX2";
      const className = "green-div";
      expect(
        transformRadipanSyntax(source, radipanId, className)
      ).toMatchSnapshot();
    });

    it("should add className prop to a Radipan Syntax element with props and children", () => {
      const source =
        'div.create({ css: { color: "green" }, radipanId: "00-XXXXXXX" }, ["Hello"])';
      const radipanId = "00-XXXXXXX";
      const className = "green-div";
      const output = `div.create({
  className: "green-div"
}, ["Hello"]);`;
      expect(transformRadipanSyntax(source, radipanId, className)).toBe(output);
    });

    it("should add className prop to a Radipan Syntax element with props only", () => {
      const source =
        'input.create({ css: { color: "blue" }, placeholder: "blue input", radipanId: "01-XXXXXXX" })';
      const radipanId = "01-XXXXXXX";
      const className = "blue-input";
      const output = `input.create({
  placeholder: "blue input",
  className: "blue-input"
});`;
      expect(transformRadipanSyntax(source, radipanId, className)).toBe(output);
    });

    it("should not add className prop to a Radipan Syntax element with children only", () => {
      const source = 'span.create("Hello")';
      const radipanId = "";
      const className = "hello-span";
      expect(transformRadipanSyntax(source, radipanId, className)).toBe(source);
    });

    it("should not add className prop to a Radipan Syntax element with no props and no children", () => {
      const source = "button.create()";
      const radipanId = "";
      const className = "empty-button";
      const output = "button.create()";
      expect(transformRadipanSyntax(source, radipanId, className)).toBe(output);
    });

    it("should return the source code directly if no match is found", () => {
      const source =
        'p.create({ css: { color: "red" }, radipanId: "02-XXXXXXX" }, ["Hello"])';
      const radipanId = "03-XXXXXXX";
      const className = "red-paragraph";
      const output = source;
      expect(transformRadipanSyntax(source, radipanId, className)).toBe(output);
    });
  });

  describe("transpile", () => {
    let srcFilename = "";
    let srcContent = "";
    const EXPORT_FOLDER = "node_modules/test_out_dir/exported";
    const filenames = {
      jsxFile: "jsxFile.jsx",
      hsFile: "hsFile.ts",
    };

    afterEach(() => {
      mock.restore();
    });

    it("should transpile JSX syntax", async () => {
      const jsxSrc = `
      <div radipanId="radipanId1" css={{ color: "red" }}>
        Hello
      </div>
      `;
      const jsxOutput = `<div className="class1">
        Hello
      </div>;`;
      srcFilename = filenames.jsxFile;
      srcContent = jsxSrc;
      process.env.CSSGEN_FILE = srcFilename;
      mock({
        [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
      });
      // Call the transpile function with some arguments
      const result = await transpile("radipanId1", "class1");
      // Expect the result to be true
      expect(result).toBe(true);
      // Expect the output file to match the expected output
      expect(
        readFileSync(`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`, "utf-8")
      ).toEqual(jsxOutput);
    });

    it("should transpile Hyperscript syntax", async () => {
      const hyperscriptSrc = `
    h("div", { radipanId: "radipanId2", css: { color: "blue" } }, "World")
    `;
      const hyperscriptOutput = `h("div", {
  className: "class2"
}, "World");`;
      srcFilename = filenames.hsFile;
      srcContent = hyperscriptSrc;
      process.env.CSSGEN_FILE = srcFilename;
      mock({
        [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
      });
      // Call the transpile function with some arguments
      const result = await transpile("radipanId2", "class2");
      // Expect the result to be true
      expect(result).toBe(true);
      // Expect the output file to match the expected output
      expect(
        readFileSync(`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`, "utf-8")
      ).toEqual(hyperscriptOutput);
    });

    it("should transpile Radipan syntax", async () => {
      const radipanSrc = `import { div, main } from "radipan/tags";
      function App() {
        return main.create({
          css: {
            width: "100%",
            height: "100vh",
            color: {base: "black",_osDark: "white"},
            background: {base: "white",_osDark: "black"}
          },
          radipanId: "11-UF7JEX2"
        }, div.create({className: "fs_2xl font_bold"}, "Hello Radip🐼n!"));
      }`;

      srcFilename = "another_file.ts";
      srcContent = radipanSrc;
      process.env.CSSGEN_FILE = srcFilename;
      mock({
        [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
      });
      // Call the transpile function with some arguments
      const result = await transpile("11-UF7JEX2", "compiled classes");
      // Expect the result to be true
      expect(result).toBe(true);
      // Expect the output file to match the expected output
      expect(
        readFileSync(`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`, "utf-8")
      ).toMatchSnapshot();
    });

    it("should return false if radipanId is not found", async () => {
      const hyperscriptSrc = `
    h("div", { radipanId: "radipanId2", css: { color: "blue" } }, "World")
    `;
      srcFilename = filenames.hsFile;
      srcContent = hyperscriptSrc;
      process.env.CSSGEN_FILE = srcFilename;
      mock({
        [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
      });
      // Call the transpile function with an invalid radipanId
      const result = await transpile("radipanId3", "class1", {});
      // Expect the result to be false
      expect(result).toBe(false);
    });

    it("should return false if closing tag is not found", async () => {
      srcFilename = filenames.jsxFile;
      srcContent = `<div radipanId={"radipanId4"} css={{ color: "green" }
      Oops
    </div>
    `;
      process.env.CSSGEN_FILE = srcFilename;
      mock({
        [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
      });
      // Call the transpile function with a valid radipanId but an invalid source file
      const result = await transpile("radipanId4", "class1");
      // Expect the result to be false
      expect(result).toBe(false);
    });
  });
});
