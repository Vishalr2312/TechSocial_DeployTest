export interface SingleAiModelInterface {
  id: number;
  name: string;
  ai_model: string;
  provider: number;
  price: string;
  stripe_product_id: string;
  stripe_price_id_recurring: string;
  stripe_price_id_onetime: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  is_subscribed: boolean;
}

export interface UserSubscribedModelsInterface {
  items: SingleAiModelInterface[];
  totalCount: number;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}
