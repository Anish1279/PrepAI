export const AUTH_COOKIE_NAMES = {
  access: "prepai_access",
  refresh: "prepai_refresh",
  csrf: "prepai_csrf",
};

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
export const PASSWORD_RESET_TTL_MINUTES = 30;
export const EMAIL_VERIFICATION_TTL_HOURS = 24;

export const AUTH_ROLES = {
  user: "user",
  admin: "admin",
};

export const AUTH_STATUS = {
  active: "active",
  disabled: "disabled",
};
