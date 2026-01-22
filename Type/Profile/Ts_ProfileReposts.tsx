export interface ResharedPostsData {
  posts: ResharedPost[];
  _links: PaginationLinks;
  _meta: PaginationMeta;
}

export interface ResharedPost {
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
  title: string;
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
  user: User;
  originPost: OriginalPost;
}

export interface OriginalPost {
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
  title: string;
  description: string | null;
  image: string | null
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

export interface User {
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
  is_email_verified: number;
  is_phone_verified: number;
  tagline: string | null;
  bio: string | null;
  description: string | null;
  website: string | null;
  phone: string;
  image: string;
  created_at: number;
  updated_at: number;
  cover_image: string | null;
  picture: string;
  coverImageUrl: string;
  follower_status: number;
  following_status: number;
  isFollower: number;
  isFollowing: number;
  profile_views: number;
  is_like: number;
  is_match: number;
}

export interface PaginationLinks {
  self: string;
  first: string;
  last: string;
}

export interface PaginationMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

