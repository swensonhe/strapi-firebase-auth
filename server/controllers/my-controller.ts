import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('firebase-auth')
      .service('myService')
      .getWelcomeMessage();
  },
});
