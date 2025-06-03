
// src/hooks/useSpaceData.ts
import { useState, useEffect, useCallback } from 'react';
import { Planet, Post, ChatMessage } from '@/types/community';
import { initialPlanetsData, initialPosts } from '@/components/community/data';

const PEERSPACE_PLANETS_KEY = 'peerspace_planets';
const PEERSPACE_POSTS_KEY = 'peerspace_posts';
const PEERSPACE_MESSAGES_KEY = 'peerspace_messages';

export const useSpaceData = () => {
  const [planets, setPlanetsState] = useState<Planet[]>([]);
  const [posts, setPostsState] = useState<Post[]>([]);
  const [messages, setMessagesState] = useState<ChatMessage[]>([]);
  const [filter, setFilter] = useState(''); // 행성 검색 필터

  useEffect(() => {
    const loadedPlanets =
      JSON.parse(localStorage.getItem(PEERSPACE_PLANETS_KEY) || 'null') ||
      initialPlanetsData;
    const loadedPosts =
      JSON.parse(localStorage.getItem(PEERSPACE_POSTS_KEY) || 'null') ||
      initialPosts;
    const loadedMessages = JSON.parse(
      localStorage.getItem(PEERSPACE_MESSAGES_KEY) || '[]'
    );

    setPlanetsState(loadedPlanets);
    setPostsState(loadedPosts);
    setMessagesState(loadedMessages);
  }, []);

  const setPlanets = useCallback(
    (newPlanets: Planet[] | ((prev: Planet[]) => Planet[])) => {
      setPlanetsState((prevPlanets) => {
        const updatedPlanets =
          typeof newPlanets === 'function'
            ? newPlanets(prevPlanets)
            : newPlanets;
        localStorage.setItem(
          PEERSPACE_PLANETS_KEY,
          JSON.stringify(updatedPlanets)
        );
        return updatedPlanets;
      });
    },
    []
  );

  const setPosts = useCallback(
    (newPosts: Post[] | ((prev: Post[]) => Post[])) => {
      setPostsState((prevPosts) => {
        const updatedPosts =
          typeof newPosts === 'function' ? newPosts(prevPosts) : newPosts;
        localStorage.setItem(PEERSPACE_POSTS_KEY, JSON.stringify(updatedPosts));
        return updatedPosts;
      });
    },
    []
  );

  const setMessages = useCallback(
    (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setMessagesState((prevMessages) => {
        const updatedMessages =
          typeof newMessages === 'function'
            ? newMessages(prevMessages)
            : newMessages;
        localStorage.setItem(
          PEERSPACE_MESSAGES_KEY,
          JSON.stringify(updatedMessages)
        );
        return updatedMessages;
      });
    },
    []
  );

  const addPlanet = useCallback(
    (planet: Planet) => {
      setPlanets((prev) => [...prev, planet]);
    },
    [setPlanets]
  );

  const addPost = useCallback(
    (post: Post) => {
      setPosts((prev) => [post, ...prev]);
    },
    [setPosts]
  );

  const updatePost = useCallback(
    (updatedPost: Post) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
    },
    [setPosts]
  );

  const deletePostById = useCallback(
    (postId: string) => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    },
    [setPosts]
  );

  const addMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
  );

  const filteredPlanets = planets.filter(
    (planet) =>
      planet.name.toLowerCase().includes(filter.toLowerCase()) ||
      planet.description.toLowerCase().includes(filter.toLowerCase()) ||
      planet.topics.some((topic) =>
        topic.toLowerCase().includes(filter.toLowerCase())
      )
  );

  return {
    planets,
    setPlanets,
    addPlanet,
    posts,
    setPosts,
    addPost,
    updatePost,
    deletePostById,
    messages,
    setMessages,
    addMessage,
    filter,
    setFilter,
    filteredPlanets,
  };
};
