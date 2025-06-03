interface NetworkSectionProps {
  friends: Array<{
    id: string;
    name: string;
    image: string;
    status: 'online' | 'offline' | 'away';
    lastActive?: string;
  }>;
  followers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  following: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  recommenders: Array<{
    id: string;
    name: string;
    image: string;
    trustLevel?: number;
    certified?: boolean;
    lastAction?: string;
  }>;
  recommendees: Array<{
    id: string;
    name: string;
    image: string;
    trustLevel?: number;
    certified?: boolean;
    lastAction?: string;
  }>;
  family: Array<{
    id: string;
    name: string;
    image: string;
    level?: '기본' | '가디언' | '퍼실리테이터';
    certified?: boolean;
    description?: string;
  }>;
  backupRecommenders: Array<{
    id: string;
    name: string;
    image: string;
    certified?: boolean;
    lastAction?: string;
  }>;
}

export default NetworkSectionProps;
