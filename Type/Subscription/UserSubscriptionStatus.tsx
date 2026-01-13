// Data Interface (contains ad_ai and work_ai)
export interface SubscriptionData {
  ad_ai: AdAiSubscription;
  work_ai: WorkAiSubscription;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

// Ad.AI Subscription Interface
export interface AdAiSubscription {
  hasSubscription: boolean;
  expired: boolean;
  subscription: AdAiPlan;
}

export interface AdAiPlan {
  id: number;
  user_id: number;
  stripe_subscription_id: string;
  type: "ad_ai";
  ai_model_id: number;
  status: "active" | "inactive" | "canceled";
  auto_renew: boolean;
  renew_interval: "monthly" | "yearly";
  started_at: string;  // ISO date string
  expires_at: string;  // ISO date string
  created_at: string;  // ISO date string
  ai_model: null; // Ad.AI does not have an AI model object
}

// Work.AI Subscription Interface
export interface WorkAiSubscription {
  hasSubscription: boolean;
  expired: boolean;
  subscriptions: WorkAiPlan[];
}

export interface WorkAiPlan {
  id: number;
  user_id: number;
  stripe_subscription_id: string;
  type: "work_ai";
  ai_model_id: number;
  status: "active" | "inactive" | "canceled";
  auto_renew: boolean;
  renew_interval: "monthly" | "yearly";
  started_at: string;
  expires_at: string;
  created_at: string;
  ai_model: AiModel;
  expired: boolean;
}

// AI Model Interface (used inside Work.AI subscriptions)
export interface AiModel {
  id: number;
  name: string;
  ai_model: string;
  provider: number;
  price: string; // could also be number if you convert it
}
