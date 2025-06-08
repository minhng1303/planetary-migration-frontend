import { User } from '../types/user';

export const decodeToken = (token: string): User => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  const payload = JSON.parse(jsonPayload);
  return {
    username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
    role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    assignedPlanetId: parseInt(payload['AssignedPlanetId'] || '0')
  };
};