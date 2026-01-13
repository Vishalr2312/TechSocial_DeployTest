// Wrapper for the nested "data"
interface SubscriptionDataWrapper {
  data: SubscriptionData;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

// Actual subscription-related data
interface SubscriptionData {
  checkoutUrl: string;
  sessionId: string;
  ephemeralKey: string;
  publishableKey: string;
  customerId: string;
  subscriptions: Subscription[];
}

// Individual subscription details
interface Subscription {
  id: number;
  modelId: number;
  stripeSubscriptionId: string;
}
