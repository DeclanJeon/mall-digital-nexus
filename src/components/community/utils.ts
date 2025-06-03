
// Random animal name generator for user names
const animals = [
  'Panda', 'Tiger', 'Lion', 'Elephant', 'Giraffe', 'Zebra', 'Kangaroo',
  'Koala', 'Penguin', 'Dolphin', 'Whale', 'Eagle', 'Owl', 'Fox', 'Wolf',
  'Bear', 'Raccoon', 'Squirrel', 'Rabbit', 'Deer', 'Monkey', 'Gorilla',
  'Cheetah', 'Leopard', 'Jaguar', 'Hippo', 'Rhino', 'Crocodile', 'Turtle',
  'Snake', 'Lizard', 'Frog', 'Butterfly', 'Bee', 'Ant', 'Spider', 'Octopus'
];

const adjectives = [
  'Happy', 'Clever', 'Brave', 'Calm', 'Quick', 'Wise', 'Kind', 'Proud',
  'Bold', 'Loyal', 'Swift', 'Smart', 'Keen', 'Wild', 'Sleek', 'Bright',
  'Noble', 'Epic', 'Grand', 'Mega', 'Super', 'Hyper', 'Ultra', 'Prime',
  'Alpha', 'Luna', 'Solar', 'Cosmic', 'Magic', 'Royal', 'Elite', 'Master'
];

export const getRandomAnimalName = (): string => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomAdjective}${randomAnimal}`;
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateUniqueId = (prefix = ''): string => {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
};
