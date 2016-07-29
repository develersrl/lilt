'use strict';

import * as pages from '../pages';

// -----------------------------------------------------------------------------
/*
    Warning: this code section is generated.
 */
{{generatedRoutes}}
// -----------------------------------------------------------------------------


/* eslint-disable quote-props */
const customRoutes = {
  'test': { title: 'Test Title', component: pages.custom.CustomTestPage },
};
/* eslint-enable quote-props */

// application routes is the union of generated routes and custom routes
const routes = { ...generatedRoutes, ... customRoutes };

// the start route key
const initialRouteId = "#9";

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
