export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  location?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
}

export type UserRole = 'farmer' | 'investor' | 'buyer' | 'admin';

export interface Project {
  id: string;
  title: string;
  description: string;
  farmerId: string;
  farmerName: string;
  location: string;
  culture: string;
  targetAmount: number;
  currentAmount: number;
  duration: number;
  expectedReturn: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  images: string[];
  investors: Investor[];
  updates: ProjectUpdate[];
  createdAt: string;
}

export interface Investor {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  investedAt: string;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  farmerId: string;
  farmerName: string;
  images: string[];
  stock: number;
  organic: boolean;
  local: boolean;
  rating: number;
  reviews: number;
  location: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  videos: CourseVideo[];
  quiz: Quiz[];
  certification: boolean;
  enrolledUsers: number;
  rating: number;
}

export interface CourseVideo {
  id: string;
  title: string;
  duration: number;
  url: string;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SoilAnalysis {
  id: string;
  userId: string;
  location: string;
  soilType: string;
  ph: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  recommendations: CropRecommendation[];
  traditionalKnowledge: TraditionalKnowledge[];
  createdAt: string;
}

export interface CropRecommendation {
  crop: string;
  suitability: number;
  expectedYield: number;
  marketDemand: number;
  plantingPeriod: string;
  harvestPeriod: string;
  tips: string[];
}

export interface TraditionalKnowledge {
  id: string;
  title: string;
  description: string;
  region: string;
  crop: string;
  technique: string;
  benefits: string[];
  source: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}