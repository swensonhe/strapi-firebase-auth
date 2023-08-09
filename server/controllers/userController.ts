

export default {
  index(ctx) {
    ctx.body = strapi.plugin("firebase-auth").service("userService").getWelcomeMessage();
  },

  list: async ctx => {
    let { pagination, nextPageToken } = ctx.query || {};

    if (!pagination) {
      pagination = {};
      pagination.page = 1;
      pagination.pageSize = 10;
    }

    ctx.body = await strapi.plugin("firebase-auth").service("userService").list(pagination, nextPageToken);
  },

  create: async ctx => {
    ctx.body = await strapi.plugin("firebase-auth").service("userService").create(ctx.request.body);
  },

  get: async ctx => {
    ctx.body = await strapi.plugin("firebase-auth").service("userService").get(ctx.params.id);
  },

  update: async ctx => {
    ctx.body = await strapi.plugin("firebase-auth").service("userService").update(ctx.params.id, ctx.request.body);
  },

  delete: async ctx => {
    ctx.body = await strapi.plugin("firebase-auth").service("userService").delete(ctx.params.id);
  },

  deleteMany: async ctx => {
    ctx.body = await strapi.plugin("firebase-auth").service("userService").deleteMany(ctx.query.ids);
  },
};
