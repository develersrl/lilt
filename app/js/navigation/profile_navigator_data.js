'use strict';

import * as pages from '../pages';
import * as state from '../state';


const routes = {
  registration: {
    title: 'REGISTRAZIONE',
    component: pages.custom.Registration,
    props: { mode: 'Registration' },
  },
  editProfile: {
    title: 'MODIFICA PROFILO',
    component: pages.custom.Registration,
    props: { mode: 'Edit' },
  },
  profile: {
    title: 'PROFILO',
    component: pages.custom.Profile,
  },
  ...state.getQuestionsRoutes(pages),
  answersThanks: {
    title: 'GRAZIE',
    component: pages.custom.MessagePage,
    props: {
      text: 'Grazie per aver completato\nil nostro questionario!'
    },
  },
  privacy: {
    title: 'INFORMATIVA',
    component: pages.custom.Privacy,
  },
};


const getRoute = (routeId, customProps) => {
  const targetRoute = routes[routeId];

  const props = {
    getRoute,
    ...targetRoute.props,
    ...customProps,
  };

  return {
    ...targetRoute,
    passProps: props,
  };
};


/**
 * This function is called to determine the "home page" of profile tab.
 * Since the app starts inside the "path" tab, the profile navigation is
 * initialized *after* the app state has been initialized (i.e. when the
 * user presses the "profile" tab for the first time).
 * With the above assumption we know that app state is ready and so the
 * state api is reliable, therefore we change the initial route according
 * to user existence.
 */
const getStartRoute = () => {
  if (state.api.userExists())
    return getRoute('profile');
  return getRoute('registration');
};


module.exports = { getStartRoute, getRoute };
