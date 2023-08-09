/**
 * @description Manual sanitize user object
 * @param {Object} user
 * @returns {Object} sanitizedUser
 */

export default user => {
  delete user.password;
  delete user.resetPasswordToken;
  delete user.confirmationToken;
  delete user.role;
  delete user.idToken;
  return user;
};
