export interface UserPublicProfile {
  id: number;
  role: number;
  name: string;
  username: string;
  email: string;
  unique_id: number;
  bio: string | null;
  description: string | null;
  image: string | null;
  picture: string | null;
  cover_image: string | null;
  coverImageUrl: string | null
  is_verified: number;
  country_code: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  sex: string | null;
  dob: string | null;
  is_biometric_login: number;
  is_push_notification_allow: number;
  like_push_notification_status: number;
  comment_push_notification_status: number;
  is_chat_user_online: number;
  chat_last_time_online: number | null;
  account_created_with: number;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  profile_visibility: number;
  follower_status: number;
  following_status: number;
  is_show_online_chat_status: number;
  is_reported: number;
  userStory: any | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
  totalFollowing: number;
  totalFollower: number;
  totalActivePost: number;
  userLiveDetail: any | null;
  giftSummary: GiftSummary;
  interest: UserInterest[];
  userSetting: any[];
  language: any[];
  featureList: FeatureItem[];
}

export interface GiftSummary {
  totalGift: number;
  totalCoin: number;
}

export interface UserInterest {
  interest_id: number;
  name: string;
}

export interface FeatureItem {
  id: number;
  name: string;
  feature_key: string;
  type: number;
  is_active: number;
}

