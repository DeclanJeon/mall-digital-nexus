
import { useState, useCallback } from 'react';
import { useSpaceData } from './useSpaceData';
import { Planet, PlanetStage } from '@/types/community';

interface PlanetFormData {
  name: string;
  description: string;
  topics: string[];
  isPrivate?: boolean;
  expiryDate?: string;
  imageUrl?: string;
}

interface PlanetCreationHook {
  createPlanet: (data: PlanetFormData, userId: string) => Promise<Planet>;
  updatePlanet: (planetId: string, data: Partial<PlanetFormData>) => Promise<Planet>;
  loading: boolean;
  error: string | null;
}

export const usePlanetCreation = (): PlanetCreationHook => {
  const { planets, setPlanets } = useSpaceData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlanet = useCallback(
    async (data: PlanetFormData, userId: string): Promise<Planet> => {
      setLoading(true);
      setError(null);

      try {
        // Validate inputs
        if (!data.name || data.name.trim() === '') {
          throw new Error('Planet name is required');
        }

        if (!data.description || data.description.trim() === '') {
          throw new Error('Description is required');
        }

        // Generate a unique ID
        const planetId = `planet_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        // Random position within bounds
        const position = {
          x: Math.random() * 100 - 50, // -50 to 50
          y: Math.random() * 100 - 50, // -50 to 50
          z: Math.random() * 10 - 5 // -5 to 5
        };

        // Create the planet object
        const newPlanet: Planet = {
          id: planetId,
          name: data.name.trim(),
          description: data.description.trim(),
          position,
          owner: userId,
          createdAt: new Date().toISOString(),
          members: [userId],
          activities: [],
          recentPosts: [],
          stage: PlanetStage.New,
          membersCount: 1,
          health: 100,
          topics: data.topics || [],
          isPrivate: data.isPrivate || false,
          expiryDate: data.expiryDate,
          imageUrl: data.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(data.name)}`
        };

        // Save to state
        setPlanets((prevPlanets) => [...prevPlanets, newPlanet]);
        setLoading(false);
        return newPlanet;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create planet';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [setPlanets]
  );

  const updatePlanet = useCallback(
    async (planetId: string, data: Partial<PlanetFormData>): Promise<Planet> => {
      setLoading(true);
      setError(null);

      try {
        // Find the planet
        const planetIndex = planets.findIndex((p) => p.id === planetId);
        if (planetIndex === -1) {
          throw new Error('Planet not found');
        }

        // Update the planet
        const updatedPlanet: Planet = {
          ...planets[planetIndex],
          ...(data.name && { name: data.name.trim() }),
          ...(data.description && { description: data.description.trim() }),
          ...(data.topics && { topics: data.topics }),
          ...(data.isPrivate !== undefined && { isPrivate: data.isPrivate }),
          ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate }),
          ...(data.imageUrl && { imageUrl: data.imageUrl })
        };

        // Save to state
        setPlanets((prevPlanets) => {
          const newPlanets = [...prevPlanets];
          newPlanets[planetIndex] = updatedPlanet;
          return newPlanets;
        });

        setLoading(false);
        return updatedPlanet;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update planet';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [planets, setPlanets]
  );

  return {
    createPlanet,
    updatePlanet,
    loading,
    error
  };
};
