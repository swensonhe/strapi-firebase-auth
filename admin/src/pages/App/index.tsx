/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route } from "react-router-dom";
import { NotFound } from "@strapi/design-system";
import { CheckPagePermissions } from "@strapi/helper-plugin";
import pluginPermissions from "../../utils/permissions";
import pluginId from "../../pluginId";
import { HomePage } from "../HomePage/HomePage";
import { EditView } from "../EditView/EditView";
import { CreateView } from "../CreateView/CreateView";

const App = () => {
  return (
    <CheckPagePermissions permissions={pluginPermissions.main}>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route path={`/plugins/${pluginId}/:id`} component={EditView} exact />
        <Route
          path={`/plugins/${pluginId}/users/create`}
          component={CreateView}
          exact
        />
        <Route component={NotFound} />
      </Switch>
    </CheckPagePermissions>
  );
};

export default App;
