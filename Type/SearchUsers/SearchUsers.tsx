export interface UserListData {
  user: UserList[];
}

export interface UserList {
  id: number;
  name: string | null;
  email: string;
  unique_id: number;
  bio: string | null;
  description: string | null;
  image: string | null;
  picture: string | null;
  coverImageUrl: string | null;
  userStory: string | null;
  profileCategoryName: string | null;
  is_verified: number;
  country_code: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  sex: string | null;
  dob: string | null;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  is_chat_user_online: number;
  chat_last_time_online: number | null;
  profile_visibility: number;
  is_reported: number;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
  totalActivePost: number;
}
