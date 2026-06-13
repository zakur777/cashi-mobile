import { useRequiredAuth } from '../contexts/AuthContext';

export function useAuth() {
  return useRequiredAuth();
}
