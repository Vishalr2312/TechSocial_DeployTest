interface CommentData {
  items: CommentItem[];
  _links: CommentLinks;
  _meta: CommentMeta;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

interface CommentItem {
  id: number;
  post_id: number;
  type: number;
  filename: string;
  comment: string;
  user_id: number;
  created_at: number;
  level: number;
  parent_id: number;
  filenameUrl: string | null;
  user?: CommentUser;
}

interface CommentUser {
  id: number;
  name: string;
  username: string;
  image: string | null;
  picture: string | null;
  coverImageUrl: string | null;
  is_chat_user_online: number;
  chat_last_time_online: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  is_reported: number;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
  userStory: string | null;
  profileCategoryName: string | null;
}

interface CommentLinks {
  self: LinkItem;
  first: LinkItem;
  last: LinkItem;
}

interface LinkItem {
  href: string;
}

interface CommentMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}
