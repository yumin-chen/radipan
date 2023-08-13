import * as React from "react";

export const useId = () => "mock_id";
export const useState = d => [d , () => d];
export const useEffect = ([f, v]) => {f();};
export const Children = React.Children;

export default React;
export * from 'react';
