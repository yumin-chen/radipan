import {
  preformat,
  addRadipanIdToJsx,
  addRadipanIdToHyperScript,
} from "./preformatter";
import { describe, expect, test } from "@jest/globals";

describe("preformatter", () => {
  describe("preformat", () => {
    test("should add radipanId JSX syntax", () => {
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

export default App;
`;
      expect(
        preformat(input).replace(/\d{2}-[A-Z0-9]{7}/g, "00-XXXXXXX")
      ).toMatchSnapshot();
    });

    test("should add radipanId to a mixture of both JSX syntax and HyperScript syntax", () => {
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

render(<App />, document.body);
`;
      expect(
        preformat(input).replace(/\d{2}-[A-Z0-9]{7}/g, "00-XXXXXXX")
      ).toMatchSnapshot();
    });
  });

  describe("addRadipanIdToJsx", () => {
    test("should add radipanId to JSX syntax", () => {
      const input = `< div css = {{ color: "red" }}>Hello</div>`;
      const output =
        /<div css={{(\r?\n?\s)*color: "red",?(\r?\n?\s)*}} radipanId="\d{2}-[A-Z0-9]{7}">Hello<\/div>;?/;
      expect(addRadipanIdToJsx(input)).toMatch(output);
    });

    test("should add radipanId to nested JSX elements", () => {
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
    test("should add radipanId to HyperScript syntax", () => {
      const input = `h("button", { css: { color: "red" } }, "Click me")`;
      const output =
        /h\("button", {\s*css: {\s*color: "red"\s*},\s*radipanId: "\d{2}-[A-Z0-9]{7}"\s*}, "Click me"\);/;
      expect(addRadipanIdToHyperScript(input)).toMatch(output);
    });

    test("should add radipanId to nested HyperScript elements", () => {
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

      const output =
        /const {\s*render\s*} = require\("react"\);\s*const App = \(\) => {\s*return h\("div", {\s*radipanId: "\d{2}-[A-Z0-9]{7}"\s*}, \[h\("h1", {\s*className: "App",\s*radipanId: "\d{2}-[A-Z0-9]{7}"\s*}, "Hello, world!"\), h\("p", "This is a paragraph."\), h\("button", {\s*onClick: \(\) => alert\("Clicked!"\),\s*radipanId: "\d{2}-[A-Z0-9]{7}"\s*}, "Click me"\)\]\);\s*};\s*render\(h\(App\), document.body\);?/;
      expect(addRadipanIdToHyperScript(input)).toMatch(output);
    });
  });
});
