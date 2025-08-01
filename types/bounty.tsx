export interface Bounty {
    id: string;
    title: string;
    description: string;
    reward: number;
    location: string;
    timeLimit: number;
    createdAt: number;
    status: 'open' | 'claimed' | 'completed';
    client: User;
    hunter: User;
    bump: number;
    submissions: Submission[] | null;
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

  export interface Submission {
    id: string;
    hunter: User;
    bounty: Bounty;
    submissionLink: string;
    selected: boolean;
    submittedAt: number;
  }