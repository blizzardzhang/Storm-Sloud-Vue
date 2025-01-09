export const checkPermission = (value:string,permissions:string[]):boolean => {
  if (!permissions || !permissions.length) return false;
  return permissions.includes(value);
}