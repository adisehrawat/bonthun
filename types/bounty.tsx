export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'delivery' | 'research' | 'task' | 'mystery' | 'tech';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  status: 'open' | 'claimed' | 'completed' | 'verified';
  clientName: string;
  clientAvatar: string;
  location: string;
  timeLimit: string;
  createdAt: string;
  claimedBy?: string;
  completedAt?: string;
  requirements: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'hunter' | 'client';
  totalEarned: number;
  totalSpent: number;
  completedBounties: number;
  successRate: number;
  rating: number;
}
// </parameter>