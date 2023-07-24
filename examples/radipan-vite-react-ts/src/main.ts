import { StrictMode } from 'react';
import { createElement as h } from 'radipan';
import ReactDOM from 'react-dom/client';
import App from './App.ts';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  h(StrictMode, {}, h(App))
);
