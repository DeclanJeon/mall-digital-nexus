// src/components/community/hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { getRandomAnimalName } from '@/components/community/utils';

export const useUserData = () => {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    let storedUsername = localStorage.getItem('peerspace_username');
    if (!storedUsername) {
      storedUsername = getRandomAnimalName();
      localStorage.setItem('peerspace_username', storedUsername);
    }
    setUsername(storedUsername);
  }, []);

  return { username };
};
