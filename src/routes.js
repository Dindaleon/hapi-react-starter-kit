import React from 'react';

import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Index from './components/Index';
import Home from './components/Home';

const routes = (
  <Route>
    <Route path="/" component={ App }>
      <IndexRoute component={ Index }/>
      <Route path="/home" component={ Home } />
      // put other routes here

    </Route>
  </Route>
);

export default routes;
