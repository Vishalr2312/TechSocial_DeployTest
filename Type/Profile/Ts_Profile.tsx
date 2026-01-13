export interface UserProfile {
  id: number;
  role: number;
  name: string;
  username: string;
  email: string;
  unique_id: number;
  bio: string | null;
  description: string | null;
  image: string | null;
  cover_image: string | null;
  is_verified: number;
  country_code: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  sex: string | null;
  dob: string | null;
  paypal_id: string | null;
  available_balance: number;
  available_coin: number;
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
  height: string | null;
  color: string | null;
  religion: string | null;
  marital_status: string | null;
  smoke_id: number | null;
  drinking_habit: string | null;
  qualification: string | null;
  occupation: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  work_experience_month: number | null;
  work_experience_year: number | null;
  profile_category_type: string | null;
  profile_visibility: number;
  follower_status: number;
  following_status: number;
  is_show_online_chat_status: number;
  is_reported: number;
  picture: string;
  coverImageUrl: string;
  userStory: string | null;
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

  interest: Interest[];
  userSetting: any[];
  language: any[];

  featureList: Feature[];
}

export interface GiftSummary {
  totalGift: number;
  totalCoin: number;
}

export interface Interest {
  interest_id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
  feature_key: string;
  type: number;
  is_active: number;
}

// export interface UserProfile {
//   id: number;
//   role: number;
//   name: string;
//   username: string;
//   email: string;
//   unique_id: number;

//   bio: string | null;
//   description: string | null;

//   image: string | null;
//   cover_image: string | null;

//   is_verified: number;

//   country_code: string | null;
//   phone: string | null;
//   website: string | null;
//   industry: string | null;
//   country: string | null;
//   city: string | null;
//   sex: string | null;
//   dob: string | null;

//   paypal_id: string | null;

//   available_balance: number;
//   available_coin: number;

//   is_biometric_login: number;
//   is_push_notification_allow: number;
//   like_push_notification_status: number;
//   comment_push_notification_status: number;

//   is_chat_user_online: number;
//   chat_last_time_online: number;

//   account_created_with: number;

//   location: string | null;
//   latitude: string | number | null;
//   longitude: string | number | null;
//   height: string | number | null;
//   color: string | null;
//   religion: string | null;
//   marital_status: string | null;

//   smoke_id: number | null;
//   drinking_habit: number | null;
//   qualification: string | null;
//   occupation: string | null;

//   country_id: number | null;
//   state_id: number | null;
//   city_id: number | null;

//   work_experience_month: number | null;
//   work_experience_year: number | null;

//   profile_category_type: string | number | null;
//   profile_visibility: number;

//   follower_status: number;
//   following_status: number;

//   is_show_online_chat_status: number;
//   is_reported: number;

//   picture: string | null;
//   coverImageUrl: string | null;

//   userStory: string | null;
//   profileCategoryName: string | null;

//   is_like: number;
//   is_match: number;

//   profile_views: number;

//   isFollower: number;
//   isFollowing: number;
// }
