import { useContext } from 'react';
import { UserContext } from '../context/UserProvider';

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
