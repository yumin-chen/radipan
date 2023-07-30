import type { Component } from "solid-js";

const App: Component = () => {
  return (
    <main
      css={{
        width: "100%",
        height: "100vh",
        color: { base: "black", _osDark: "white" },
        background: { base: "white", _osDark: "black" },
      }}
    >
      <div css={{ fontSize: "2xl", fontWeight: "bold" }}>Hello Radip🐼n!</div>
    </main>
  );
};

export default App;
