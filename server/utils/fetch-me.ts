import sanitizeUser from "./sanitize-user";

const MANDADATORY_RELATIONS = ["image"];

export const fetchUser = async (currentUser, populate:string[] = ["*"]) => {
  if (!Array.isArray(populate)) {
    populate = [populate];
  }

  MANDADATORY_RELATIONS.forEach(relation => {
    if (!populate.includes(relation)) {
      populate.push(relation);
    }
  });
  return strapi.entityService.findOne("plugin::users-permissions.user", currentUser.id, {
    populate,
  });
};

export const processMeData = async (currentUser, populate = ["*"]) => {
  let user = await fetchUser(currentUser, populate);
  user = sanitizeUser(user);
  return user;
};


