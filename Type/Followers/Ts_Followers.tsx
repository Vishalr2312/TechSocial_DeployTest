export interface FollowingList {
  items: FollowingItem[];
  _links: PaginationLinks;
  _meta: PaginationMeta;
}

export interface FollowingItem {
  id: number;
  user_id: number;
  follower_id: number;
  type: number;
  created_at: number;
  reference_id: number;
  source_type: number;
  followingUserDetail: FollowingUserDetail;
}

export interface FollowingUserDetail {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  description: string | null;
  image: string | null;
  is_verified: number;
  country_code: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  sex: string | null;
  dob: string | null;
  is_chat_user_online: number;
  chat_last_time_online: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  profile_visibility: number;
  is_reported: number;
  picture: string | null;
  coverImageUrl: string | null;
  userStory: unknown | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
}

export interface FollowerList {
  items: FollowerItem[];
  _links: PaginationLinks;
  _meta: PaginationMeta;
}

export interface FollowerItem {
  id: number;
  user_id: number;
  follower_id: number;
  type: number;
  created_at: number;
  reference_id: number;
  source_type: number;
  followerUserDetail: FollowerUserDetail;
}

export interface FollowerUserDetail {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  description: string | null;
  image: string | null;
  is_verified: number;
  country_code: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  sex: string | null;
  dob: string | null;
  is_chat_user_online: number;
  chat_last_time_online: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  profile_visibility: number;
  is_reported: number;
  picture: string | null;
  coverImageUrl: string | null;
  userStory: unknown | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
}

export interface PaginationLinks {
  self: LinkItem;
  first: LinkItem;
  last: LinkItem;
}

export interface LinkItem {
  href: string;
}

export interface PaginationMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}
