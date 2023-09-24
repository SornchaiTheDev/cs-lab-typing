export type FrontTypingHistory = {
  id: string;
  raw_speed: number;
  adjusted_speed: number;
  percent_error: number;
  score?: number;
  started_at: Date;
  ended_at: Date;
  created_at: Date;
};
