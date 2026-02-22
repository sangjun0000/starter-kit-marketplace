export interface Review {
  id: string;
  kitId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  version: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface RatingSummary {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
