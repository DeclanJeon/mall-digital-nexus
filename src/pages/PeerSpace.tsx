
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PeerSpaceHome from '@/components/peer-space/PeerSpaceHome';

const PeerSpace = () => {
  const location = useLocation();
  const { address } = useParams<{ address: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(true); // In reality, this would be based on authentication

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <PeerSpaceHome isOwner={isOwner} />
  );
};

export default PeerSpace;
