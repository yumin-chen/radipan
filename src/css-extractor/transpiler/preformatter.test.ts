import { preformat } from "./preformatter";
import { describe, expect, test } from "@jest/globals";

describe("preformatter::preformat", () => {
  test("should add radipanId to JSX syntax", () => {
    const input = `<div css={{ color: "red" }}>Hello</div>`;
    const output =
      /<div radipanId={"\d{2}-[A-Z0-9]{7}"} css={{ color: "red" }}>Hello<\/div>/;
    expect(preformat(input)).toMatch(output);
  });

  test("should add radipanId to JSX syntax with multiple lines", () => {
    const input = `<div css={{
      color: "red",
      background: "white"
    }}>Hello</div>`;
    const output =
      /<div radipanId={"\d{2}-[A-Z0-9]{7}"} css={{\r?\n      color: \"red\",\r?\n      background: \"white\"\r?\n    }}>Hello<\/div>/;
    expect(preformat(input)).toMatch(output);
  });

  test("should add radipanId to HyperScript syntax", () => {
    const input = `h("div", { css: { color: "red" }}, "Hello")`;
    const output =
      /h\("div", { radipanId: "\d{2}-[A-Z0-9]{7}", css: { color: "red" }}, "Hello"\)/;
    expect(preformat(input)).toMatch(output);
  });

  test("should add radipanId to HyperScript syntax with multiple lines", () => {
    const input = `h("div", { css: {
      color: "red",
      background: "white"
    }}, "Hello")`;
    const output =
      /h\("div",\s*{\s*radipanId:\s*"\d{2}-[A-Z0-9]{7}",\s*css:\s*{\r?\n\s*color:\s*"red",\r?\n\s*background:\s*"white"\r?\n\s*}\s*},\s*"Hello"\)/;
    expect(preformat(input)).toMatch(output);
  });
});
