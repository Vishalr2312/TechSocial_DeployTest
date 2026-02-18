export interface Post {
  id: number;
  user_id: number;
  type: number;
  post_content_type: number;
  content_type_reference_id: number | null;
  unique_id: string;
  audio_id: number | null;
  audio_start_time: number | null;
  audio_end_time: number | null;
  is_add_to_post: number;
  competition_id: number | null;
  club_id: number | null;
  campaign_id: number | null;
  event_id: number | null;
  is_winning: number;
  title: string | null;
  description: string | null;
  image: string | null;
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  popular_point: number;
  is_share_post: number;
  share_level: number;
  ai_search_views: number;
  origin_post_id: number | null;
  address: string;
  latitude: string;
  longitude: string;
  is_comment_enable: number;
  status: number;
  created_at: number;
  created_by: number;
  updated_at: number | null;
  updated_by: number | null;
  share_comment: string | null;
  poll_id: number | null;
  display_whose: number;
  share_link: string;
  postGallary: PostGallery[];
  is_like: number;
  is_reported: number;
  hashtags: any[];
  mentionUsers: any[];
  is_promotion: number;
  is_saved: number;
  total_post_views: number;
  pollDetails: any | null;
  user: PostUser;
  clubDetail: any | null;
  giftSummary: GiftSummary;
}

export interface PostGallery {
  id: number;
  post_id: number;
  filename: string;
  video_thumb: string;
  media_type: number;
  type: number;
  is_default: number;
  audio_time: number;
  pcm_data: string | null;
  status: number;
  created_at: number;
  updated_at: number | null;
  width: number;
  height: number;
  filenameUrl: string;
  videoThumbUrl: string | null;
}

export interface PostUser {
  id: number;
  name: string;
  username: string;
  email: string;
  image: string;
  picture: string;
  is_chat_user_online: number;
  chat_last_time_online: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  is_reported: number;
  coverImageUrl: string | null;
  userStory: any | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
  userLiveDetail: any | null;
}

export interface GiftSummary {
  totalGift: number;
  totalCoin: number;
}
