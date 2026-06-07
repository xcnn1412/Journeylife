import type { Access } from "payload";

/** Logged-in admin only. */
export const isAdmin: Access = ({ req }) => req.user?.role === "admin";

/** Logged-in staff (admin or editor) — anyone allowed to author content. */
export const isStaff: Access = ({ req }) =>
  req.user?.role === "admin" || req.user?.role === "editor";
