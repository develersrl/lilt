'use strict';

import * as pages from '../pages';

// -----------------------------------------------------------------------------
/*
    Warning: this file is generated. If you need to change it please edit
    navigator_data.tmpl.js inside content/templates folder.
 */
// -----------------------------------------------------------------------------

{{generatedRoutes}}


/* eslint-disable quote-props */
const customRoutes = {
  'home': { title: 'LILT App', component: pages.custom.Home },
  'test': { title: 'Test Title', component: pages.custom.CustomTestPage },
  'glossary': { title: 'Glossary', component: pages.custom.Glossary },
  'link-list': { title: 'Link List', component: pages.custom.LinkList },
  'content': { 'title': 'Content', component: pages.custom.Content },
  'registration': {
    'title': 'Registration',
    component: pages.custom.Registration,
  },
};
/* eslint-enable quote-props */

// application routes is the union of generated routes and custom routes
const routes = { ...generatedRoutes, ... customRoutes };

// the start route key
const initialRouteId = "home";

/*
  Obtain a navigation route from route id, which corresponds to "page" id in
  pages.json.
  We pass each route a pointer to getRoute function itself so that each route
  can switch page by calling "this.props.getRoute(<route_id>)".
 */
const getRoute = (routeId) => ({ ...routes[routeId], passProps: { getRoute } });

// Return the app start route.
const getStartRoute = () => getRoute(initialRouteId);


module.exports = { getStartRoute, getRoute };
