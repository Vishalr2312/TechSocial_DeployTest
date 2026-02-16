export interface NotificationCollection {
  items: NotificationApiItem[];
  _links: {
    self: LinkRef;
    first: LinkRef;
    last: LinkRef;
  };
  _meta: PaginationMeta;
}

export interface LinkRef {
  href: string;
}

export interface PaginationMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

export interface NotificationApiItem {
  id: number;
  type: number;
  user_id: number;
  reference_id: number | null;
  title: string;
  message: string;
  read_status: number; // 0 | 1
  created_at: number;
  created_by: number;
  createdByUser: NotificationUser | null;
  refrenceDetails: NotificationReferenceDetails | null;
}

export interface NotificationUser {
  id: number;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  cover_image: string | null;
  picture: string | null;
  coverImageUrl: string | null;
  is_chat_user_online: number;
  chat_last_time_online: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  is_reported: number;
  userStory: any | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
}

export type NotificationReferenceDetails =
  | ReferenceUser
  | ReferencePost
  | ReferenceComment
  | null;

export interface ReferenceUser {
  id: number;
  name: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  description: string | null;
  image: string | null;
  picture: string | null;
  coverImageUrl: string | null;
  country_code: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  sex: string | null;
  is_reported: number;
  userStory: any | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
}

export interface ReferencePost {
  id: number;
  user_id: number;
  type: number;
  title: string;
  share_link: string;
  postGallary: PostGalleryItem[];
  is_like: number;
  is_reported: number;
  hashtags: any[];
  mentionUsers: any[];
  is_promotion: number;
  is_saved: number;
  total_post_views: number;
  pollDetails: any | null;
}

export interface PostGalleryItem {
  id: number;
  post_id: number;
  filename: string;
  filenameUrl: string | null;
  video_thumb: string;
  videoThumbUrl: string | null;
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
}

export interface ReferenceComment {
  id: number;
  post_id: number;
  level: number;
  parent_id: number;
  user_id: number;
  type: number;
  comment: string;
  filename: string | null;
  filenameUrl: string | null;
  audio_time: number;
  pcm_data: any | null;
  status: number;
  created_at: number;
}

// Optional
export enum NotificationType {
  FOLLOW = 1,
  COMMENT = 2,
  POST_LIKE = 3,
  COMMENT_LIKE = 21,
  CHAT = 100,
}
