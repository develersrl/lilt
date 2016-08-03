'use strict';


/*
  Enable or disable a given api.
  @param api Input api, represented as a javascript object of functions.
  @param enabled Enabled/disabled flag.
  @return The input api if enabled, an api of "empty" functions otherwise.

  Example of input api:

  inputApi = {
    foo1: (x) => x * x,
    foo2: () => console.log('hello'),
  }

  Example of disabled output api:

  outputApi = {
    foo1: (x) => {},
    foo2: () => {},
  }
 */
const enableApi = (api, enabled) => {
  if (enabled)
    return api;

  const disabledApi = {};

  for (const k of Object.keys(api)) {
    disabledApi[k] = (...args) => {
      args;
    };
  }

  return disabledApi;
};


module.exports = {
  enableApi,
};
