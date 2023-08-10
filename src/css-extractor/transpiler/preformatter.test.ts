import {
  preformat,
  addRadipanIdToJsx,
  addRadipanIdToHyperScript,
  addRadipanIdToRadipanSyntax,
} from "./preformatter";
import { describe, expect, it } from "@jest/globals";

const constantizeRadipanId = (source: string) =>
  source.replace(/\d{2}-[A-Z0-9]{7}/g, "00-XXXXXXX");

describe("preformatter", () => {
  describe("preformat", () => {
    it("should add radipanId JSX syntax", () => {
      const input = `
function App() {
  return (
    <main
      css={{
        width: "100%",
        height: "100vh",
        color: { base: "black", _osDark: "white" },
        background: { base: "white", _osDark: "black" },
      }}
    >
      <div css={divCss}>Hello Radip🐼n!</div>
    </main>
  );
}

const divCss = { fontSize: "2xl", fontWeight: "bold" };

export default App;`;

      const result = preformat(input);

      expect(constantizeRadipanId(result)).toMatchSnapshot();
    });

    it("should add radipanId to a mixture of both JSX syntax and HyperScript syntax", () => {
      const input = `
const { render } = require("react");

const App = () => {
  return h("div", [
    h("h1", { className: "App" }, "Hello, world!"),
    h("p", "This is a paragraph."),
    h(Button, { onClick: () => alert("Clicked!") }, "Click me"),
  ]);
};

const Button = ({children}) => {
  return (<button role="button">children</button>);
};

render(<App />, document.body);`;

      const result = preformat(input);

      expect(constantizeRadipanId(result)).toMatchSnapshot();
    });
  });

  describe("addRadipanIdToJsx", () => {
    it("should add radipanId to JSX syntax", () => {
      const input = `< div css = {{ color: "red" }}>Hello</div>`;
      const output =
        /<div css={{(\r?\n?\s)*color: "red",?(\r?\n?\s)*}} radipanId="\d{2}-[A-Z0-9]{7}">Hello<\/div>;?/;
      expect(addRadipanIdToJsx(input)).toMatch(output);
    });

    it("should add radipanId to nested JSX elements", () => {
      const input = `<main><div css={{
        color: "red",
        background: "white"
      }}>Hello</div></main>`;
      const output =
        /<main radipanId="\d{2}-[A-Z0-9]{7}"><div css={{(\r?\n?\s)*color: \"red\",(\r?\n?\s)*background: \"white\",?(\r?\n?\s)*}} radipanId="\d{2}-[A-Z0-9]{7}">Hello<\/div><\/main>;?/;
      expect(addRadipanIdToJsx(input)).toMatch(output);
    });
  });

  describe("addRadipanIdToHyperScript", () => {
    it("should add radipanId to HyperScript syntax", () => {
      const input = `h("button", { css: { color: "red" } }, "Click me")`;
      const output =
        /h\("button", {\s*css: {\s*color: "red"\s*},\s*radipanId: "\d{2}-[A-Z0-9]{7}"\s*}, "Click me"\);/;
      expect(addRadipanIdToHyperScript(input)).toMatch(output);
    });

    it("should add radipanId to HyperScript syntax with ommited props and children", () => {
      const input = `h(Badge)`;
      const output =
        /h\(Badge,\s*{(\r?\n?\s)*radipanId: "\d{2}-[A-Z0-9]{7}"(\r?\n?\s)*}\);/;
      expect(addRadipanIdToHyperScript(input)).toMatch(output);
    });

    it("should add radipanId to nested HyperScript elements", () => {
      const input = `
      const { render } = require("react");

      const App = () => {
        return h("div", [
          h("h1", { className: "App" }, "Hello, world!"),
          h("p", "This is a paragraph."),
          h("button", { onClick: () => alert("Clicked!") }, "Click me"),
        ]);
      };

      render(h(App), document.body);
      `;

      const result = addRadipanIdToHyperScript(input);

      expect(constantizeRadipanId(result)).toMatchSnapshot();
    });
  });

  describe("addRadipanIdToRadipanSyntax", () => {
    it("should add radipanId to a simple Radipan Syntax element", () => {
      const input = `div.create({ css: { color: "red" } }, "whee!")`;

      const result = addRadipanIdToRadipanSyntax(input);

      expect(constantizeRadipanId(result)).toMatchSnapshot();
    });

    it("should add radipanId to a Radipan Syntax element with ommited props and children", () => {
      const input = "Badge.create()";
      const output =
        /Badge\.create\({(\r?\n?\s)*radipanId: "\d{2}-[A-Z0-9]{7}"(\r?\n?\s)*}\);?/;

      const result = addRadipanIdToRadipanSyntax(input);

      expect(result).toMatch(output);
    });

    it("should add radipanId to a Radipan Syntax element with ommited props", () => {
      const input = 'Badge.create("Text")';
      const output =
        /Badge\.create\({(\r?\n?\s)*radipanId: "\d{2}-[A-Z0-9]{7}"(\r?\n?\s)*}, "Text"\);?/;

      const result = addRadipanIdToRadipanSyntax(input);

      expect(result).toMatch(output);
    });

    it("should add radipanId to a nested Radipan Syntax element", () => {
      const input = `
      form.create({ css: { display: "flex" } }, [
        div.create({ css: { color: "green" } }, "green div"),
        span.create({ css: { color: "red" } }, "red span"),
        input.create({ css: { color: "blue" }, placeholder: "blue input" }),
      ])
    `;

      const result = addRadipanIdToRadipanSyntax(input);

      expect(constantizeRadipanId(result)).toMatchSnapshot();
    });

    it("should add radipanId to a Radipan Syntax element with no props", () => {
      const input = 'div.create("Hello")';
      const output = `div.create({
  radipanId: "00-XXXXXXX"
}, "Hello");`;

      const result = addRadipanIdToRadipanSyntax(input);

      expect(constantizeRadipanId(result)).toBe(output);
    });
  });
});
