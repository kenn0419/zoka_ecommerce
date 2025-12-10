export function getAccessTokenFromCookie() {
  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((c) => c.startsWith("accessToken="));

  if (!tokenCookie) return null;

  return tokenCookie.split("=")[1];
}

export const setAccessTokenCookie = (token: string) => {
  document.cookie = `accessToken=${token}; path=/; secure; samesite=strict`;
};
