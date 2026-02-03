export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  workplace: string;
};

export type Workplace = {
  id: string;
  name: string;
};

export type VoteHistory = {
  id: string;
  title: string;
  choice: string;
  enhanced: number;
};

export type PointsHistoryEntry = {
  id: string;
  label: string;
  amount: number;
};

export type UserProfileData = {
  name: string;
  role: string;
  workCred: number;
  workplace: string;
  votingHistory: VoteHistory[];
  pointsHistory: PointsHistoryEntry[];
};

export type WagerVote = {
  option: string;
  percent: number;
};

export type Wager = {
  id: string;
  status: string;
  tags: string[];
  title: string;
  description: string;
  votes: WagerVote[];
  totalCred: number;
  winner?: string | null;
  options?: string[];
};
