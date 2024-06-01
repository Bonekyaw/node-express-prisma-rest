/*
 * Authorization
 * These two functions are same
 * authorise(true, admin, "super", "manager", "editor") === authorise(false, admin, "user")
 * true means that his role must be one of these.
 * false means that his role must not be one of these.
 */

const authorise = (permission: boolean, admin: any, ...roles: string[]) => {
  const result = roles.includes(admin.role);

  if (!permission && result) {
    const err: any = new Error("This action is not allowed.");
    err.status = 403;
    throw err;
  }

  if (permission && !result) {
    const err: any = new Error("This action is not allowed.");
    err.status = 403;
    throw err;
  }
};

export default authorise;
