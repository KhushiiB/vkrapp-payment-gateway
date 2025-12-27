export const decodeJWT = (token: string) => {
  const [header, payload, signature] = token.split(".");
  try {
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    return null;
  }
};
