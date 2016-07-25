'use strict';

import * as pages from '../pages';

// -----------------------------------------------------------------------------
/*
    Warning: this code section is generated.
 */
{{routes}}

{{initialRouteId}}
// -----------------------------------------------------------------------------

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
