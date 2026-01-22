export const includeRole = (user: any, role: string) => {
  return user?.roles?.some((item: any) => item.name === role);
};
