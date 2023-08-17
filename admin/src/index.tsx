/* eslint-disable @typescript-eslint/no-explicit-any */
import { prefixPluginTranslations } from "@strapi/helper-plugin";

import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import pluginPermissions from "./utils/permissions";
import getTrad from "./utils/getTrad";

const name = pluginPkg.strapi.name;

export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad("SettingsNav.section-label"),
          defaultMessage: "Firebase-Auth Plugin",
        },
      },
      [
        {
          intlLabel: {
            id: getTrad("Settings.firebase-auth.plugin.title"),
            defaultMessage: "Settings",
          },
          id: "settings",
          to: `/settings/${pluginId}`,
          async Component() {
            const component = await import(
              /* webpackChunkName: "email-settings-page" */ "./pages/Settings"
            );

            return component;
          },
          permissions: pluginPermissions.settings,
        },
      ],
    );
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return Promise.resolve(importedTrads);
  },
};
