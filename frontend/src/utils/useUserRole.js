// src/hooks/useUserRole.js
export const useUserRole = () => {
  // In real usage, you’d get this from context, Redux, or auth
  return localStorage.getItem('userRole') || 'guest';
};
