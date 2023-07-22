import { framework } from 'radipan/radipan.config.json';

const getHyperScript = () => {
  switch (framework) {
    case 'react': {
      try {
        const react = require('react');
        return react.createElement;
      } catch (error) {
        console.error('Failed to load `react`');
      }
    }
    case 'preact': {
      try {
        const preact = require('preact');
        return preact.h;
      } catch (error) {
        console.error('Failed to load `preact`');
      }
    }
    case 'solid-js':
    case 'solid': {
      try {
        const solid = require('solid-js/h');
        return solid;
      } catch (error) {
        console.error('Failed to load `solid`');
      }
    }
    case 'svelte': {
      try {
        const svelte = require('svelte-hyperscript')
        return svelte;
      } catch (error) {
        console.error('Failed to load `svelte`');
      }
    }
  }
};

export const h = getHyperScript();
