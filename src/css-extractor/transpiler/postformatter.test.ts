import {
  postformat,
  removeRadipanIdFromJsx,
  removeRadipanIdFromHyperScript,
} from "./postformatter";
import { describe, expect, it } from "@jest/globals";

describe("postformatter", () => {
  describe("removeRadipanIdFromJsx", () => {
    it("should remove radipanId from a simple JSX element", () => {
      const input = `<div radipanId="1-abc">Hello</div>`;
      const output = `<div>Hello</div>;`;
      expect(removeRadipanIdFromJsx(input)).toBe(output);
    });

    it("should remove radipanId from a nested JSX element", () => {
      const input = `
      <div radipanId="2-def">
        <h1 radipanId="3-ghi">Title</h1>
        <p radipanId="4-jkl">Content</p>
      </div>
    `;
      const output = `<div>
        <h1>Title</h1>
        <p>Content</p>
      </div>;`;
      expect(removeRadipanIdFromJsx(input)).toBe(output);
    });

    it("should remove radipanId from a JSX element with other props", () => {
      const input = `<button radipanId="5-mno" onClick={handleClick} className="btn">Click me</button>`;
      const output = `<button onClick={handleClick} className="btn">Click me</button>;`;
      expect(removeRadipanIdFromJsx(input)).toBe(output);
    });
  });

  describe("removeRadipanIdFromHyperScript", () => {
    it("should remove radipanId from a simple HyperScript element", () => {
      const input = `h("div", { radipanId: "1-abc" }, "Hello")`;
      const output = `h("div", {}, "Hello");`;
      expect(removeRadipanIdFromHyperScript(input)).toBe(output);
    });

    it("should remove radipanId from a nested HyperScript element", () => {
      const input = `
      h("div", { radipanId: "2-def" }, [
        h("h1", { radipanId: "3-ghi" }, "Title"),
        h("p", { radipanId: "4-jkl" }, "Content"),
      ])
    `;
      const output = `h("div", {}, [h("h1", {}, "Title"), h("p", {}, "Content")]);`;
      expect(removeRadipanIdFromHyperScript(input)).toBe(output);
    });

    it("should remove radipanId from a HyperScript element with other props", () => {
      const input = `h("button", { radipanId: "5-mno", onClick: handleClick, className: "btn" }, "Click me")`;
      const output = `h("button", {
  onClick: handleClick,
  className: "btn"
}, "Click me");`;
      expect(removeRadipanIdFromHyperScript(input)).toBe(output);
    });
  });
});
