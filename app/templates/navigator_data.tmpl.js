'use strict';

import * as pages from '../pages';


// -----------------------------------------------------------------------------
/*
    Warning: this file is generated. If you need to change it please edit
    navigator_data.tmpl.js inside content/templates folder.
 */
// -----------------------------------------------------------------------------

{{glossaryBindings}}


{{generatedRoutes}}


/* eslint-disable quote-props */
const customRoutes = {
  'home': {
    title: '',
    component: pages.custom.Home,
    props: { barVisible: false },
    navigationBarHidden: true,
  },
  'test': { title: 'Test Title', component: pages.custom.CustomTestPage },
  'glossary': { title: 'GLOSSARIO', component: pages.custom.Glossary },
  'customPrevention': {
    title: 'IL MIO PERCORSO',
    component: pages.custom.CustomPrevention,
  },
};
/* eslint-enable quote-props */

// application routes is the union of generated routes and custom routes
const routes = {
  ...generatedRoutes,
  ...customRoutes,
};

// the start route key
const initialRouteId = "home";

/**
  Obtain a navigation route from route id, which corresponds to "page" id in
  pages.json.
  We pass each route a pointer to getRoute function itself so that each route
  can switch page by calling "this.props.getRoute(<route_id>)".
 */
const getRoute = (routeId, customProps) => {
  const targetRoute = routes[routeId];

  const props = {
    getRoute,
    getRouteForGlossaryWord,
    ...targetRoute.props,
    ...customProps,
  };

  return {
    ...targetRoute,
    passProps: props,
  };
};


/**
 * Return the app start route.
 */
const getStartRoute = () => getRoute(initialRouteId);

/**
 * Return app route for specific glossary word.
 */
const getRouteForGlossaryWord = (word) => {
  if (glossaryBindings.hasOwnProperty(word))
    return getRoute(glossaryBindings[word]);
  return null;
};


module.exports = { getStartRoute, getRoute, getRouteForGlossaryWord };
