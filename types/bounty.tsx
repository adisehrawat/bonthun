export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
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
  bountiesRewarded: number;
  rating: number;
}
// </parameter>