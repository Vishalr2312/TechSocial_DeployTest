interface PostData {
  items: PostItem[];
  _links: PostLinks;
  _meta: PostMeta;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

// interface PostItem {
//   id: number;
//   type: number;
//   post_content_type: number;
//   content_type_reference_id: number | null;
//   unique_id: string;
//   user_id: number;
//   title: string;
//   description: string | null;
//   competition_id: number | null;
//   club_id: number | null;
//   event_id: number | null;
//   campaign_id: number | null;
//   image: string | null;
//   total_view: number;
//   total_like: number;
//   total_comment: number;
//   total_share: number;
//   ai_search_views: number;
//   popular_point: number;
//   status: number;
//   created_at: number;
//   latitude: number | null;
//   longitude: number | null;
//   address: string | null;
//   audio_id?: number | null;
//   audio_start_time?: number | null;
//   audio_end_time?: number | null;
//   is_add_to_post?: number;
//   is_share_post?: number;
//   origin_post_id?: number | null;
//   share_comment: string | null;
//   poll_id: number | null;
//   is_comment_enable: number;
//   display_whose: number;
//   share_link: string;
//   postGallary: PostGalleryItem[];
//   is_like: number;
//   is_reported: number;
//   hashtags: string[];
//   mentionUsers: string[];
//   is_promotion: number;
//   is_saved: number;
//   user: User;
// }
interface BasePost {
  id: number;
  type: number;
  post_content_type: number;
  content_type_reference_id: number | null;
  unique_id: string;
  user_id: number;
  title: string;
  description: string | null;
  image: string | null;
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  ai_search_views: number;
  popular_point: number;
  status: number;
  created_at: number;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  is_like: boolean;
  is_reported: number;
  hashtags: string[];
  mentionUsers: string[];
  is_promotion: number;
  is_saved: boolean;
  share_link: string;
}

interface PostItem extends BasePost {
  id: number;
  type: number;
  post_content_type: number;
  content_type_reference_id: number | null;
  unique_id: string;
  user_id: number;
  title: string;
  description: string | null;
  competition_id: number | null;
  club_id: number | null;
  event_id: number | null;
  campaign_id: number | null;
  image: string | null;
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  ai_search_views: number;
  popular_point: number;
  status: number;
  created_at: number;
  created_by: number;
  updated_at: number;
  updated_by: number;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  audio_id?: number | null;
  audio_start_time?: number | null;
  audio_end_time?: number | null;
  is_add_to_post?: number;
  is_share_post?: number;
  share_level?: number;
  is_winning?: number;
  origin_post_id?: number | null;
  share_comment: string | null;
  poll_id: number | null;
  is_comment_enable: number;
  display_whose: number;
  share_link: string;
  postGallary: PostGalleryItem[];
  is_like: boolean;
  is_reported: number;
  is_promotion: number;
  is_saved: boolean;
  hashtags: string[];
  mentionUsers: string[];
  user: User;
  originPost?: OriginPost;
  // comments?: PostComment[];
}

interface OriginPost extends BasePost {
  created_by: number;
  updated_at: number;
  updated_by: number;

  audio_id?: number | null;
  audio_start_time?: number | null;
  audio_end_time?: number | null;

  is_add_to_post?: number;
  is_share_post?: number;
  share_level?: number;
  origin_post_id?: number | null;

  is_comment_enable: number;
  display_whose: number;

  postGallary: PostGalleryItem[];
  user: User; // ✅ THIS is originPost.user
}

interface User {
  id: number;
  role: number;
  package_id: number | null;
  username: string;
  name: string;
  email: string;
  unique_id: number;
  dob: string | null;
  status: number;
  is_verified: number;
  user_verification_id: number | null;
  is_email_verified: number;
  is_phone_verified: number;
  verification_with: number;
  account_created_with: number;
  tagline: string | null;
  bio: string | null;
  description: string | null;
  website: string | null;
  sex: number | null;
  phone: string | null;
  country_code: string | null;
  postcode: string | null;
  address: string | null;
  country_id: number | null;
  country: string | null;
  city: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  last_active: number | null;
  facebook: string | null;
  twitter: string | null;
  apple: string | null;
  googleplus: string | null;
  linkedin: string | null;
  instagram: string | null;
  oauth_provider: string | null;
  oauth_uid: string | null;
  oauth_link: string | null;
  online: number;
  notify: number;
  notify_cat: number | null;
  created_at: number;
  updated_at: number;
  verification_token: string | null;
  device_type: number;
  device_token: string | null;
  device_token_voip_ios: string | null;
  paypal_id: string | null;
  available_balance: number;
  available_coin: number;
  is_biometric_login: number;
  is_push_notification_allow: number;
  like_push_notification_status: number;
  comment_push_notification_status: number;
  socket_id: string | null;
  is_chat_user_online: number;
  is_show_online_chat_status: number;
  chat_last_time_online: number | null;
  chat_delete_period: number;
  is_login_first_time: number;
  user_token: string | null;
  user_connection_id: number | null;
  is_online: number | null;
  state: string | null;
  height: string | null;
  color: string | null;
  religion: string | null;
  marital_status: string | null;
  smoke_id: number | null;
  drinking_habit: number | null;
  qualification: string | null;
  occupation: string | null;
  state_id: number | null;
  city_id: number | null;
  work_experience_month: number | null;
  work_experience_year: number | null;
  profile_category_type: number;
  profile_visibility: number;
  cover_image: string | null;
  coverImageUrl: string | null;
  ad_package_id: number | null;
  follower_status: number;
  following_status: number;
  industry: string | null;
  stripe_customer_id: string | null;
  free_ai_hits: number;
  last_ai_hit_at: string | null;
  is_reported: number;
  picture: string | null;
  userStory: string | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: boolean;
  isFollowing: boolean;
}

interface PostGalleryItem {
  id: number;
  post_id: number;
  filename: string;
  video_thumb: string;
  media_type: number;
  type: number;
  is_default: number;
  audio_time: number;
  pcm_data: any | null;
  status: number;
  created_at: number;
  updated_at: number | null;
  width: number;
  height: number;
  filenameUrl: string;
  videoThumbUrl: string | null;
}

// interface User {
//   id: number;
//   role: number;
//   username: string;
//   name: string;
//   email: string;
//   bio: string;
//   description: string | null;
//   image: string;
//   is_verified: number;
//   country_code: string | null;
//   phone: string;
//   country: string;
//   city: string;
//   sex: string | null;
//   dob: string | null;
//   is_chat_user_online: number;
//   chat_last_time_online: number;
//   location: string | null;
//   latitude: number | null;
//   longitude: number | null;
//   is_reported: number;
//   picture: string;
//   coverImageUrl: string | null;
//   userStory: any | null;
//   profileCategoryName: string | null;
//   is_like: number;
//   is_match: number;
//   profile_views: number;
//   isFollower: number;
//   isFollowing: number;
// }

interface PostLinks {
  self: { href: string };
  first: { href: string };
  last: { href: string };
  next?: { href: string };
}

interface PostMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}
