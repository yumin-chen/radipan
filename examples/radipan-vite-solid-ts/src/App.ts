import type { Component } from 'solid-js';
import { main, div } from 'radipan/tags';

const App: Component = () => {
  return main.create(
    {
      css: {
        width: '100%',
        height: '100vh',
        color: { base: 'black', _osDark: 'white' },
        background: { base: 'white', _osDark: 'black' },
      },
    },
    div.create(
      { css: { fontSize: '2xl', fontWeight: 'bold' } },
      'Hello Radip🐼n!'
    )
  );
};

export default App;
