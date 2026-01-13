import * as Yup from 'yup';

export interface UserInterface {
  id: number;
  role: number;
  name: string | null;
  username: string;
  email: string;
  unique_id: number;
  bio: string | null;
  status: number;
  description: string | null;
  image: string | null;
  cover_image: string | null;
  is_verified: number;
  country_code: string | null;
  phone: string;
  country: string | null;
  city: string | null;
  sex: string | null;
  dob: string | null;
  paypal_id: string | null;
  available_balance: number;
  available_coin: number;
  is_biometric_login: number;
  is_push_notification_allow: number;
  account_created_with: number;
  is_login_first_time: number;
  profile_visibility: number;
  follower_status: number;
  following_status: number;
  is_show_online_chat_status: number;
  is_reported: number;
  picture: string | null;
  coverImageUrl: string | null;
  userStory: any | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
  totalActivePost?: number;
  totalFollower?: number;
  totalFollowing?: number;
  website?: string;
  industry?: string;
  location?: string;
}

export interface SignInResponseInterface {
  user?: UserInterface;
  auth_key?: string;
  token?: string;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

export interface SignInInitialValueType {
  email: string;
  password: string;
  device_type: number;
  device_token: string;
  device_token_voip_ios: string;
}

export const SignInInitialValue: SignInInitialValueType = {
  email: '',
  password: '',
  device_type: 1,
  device_token: 'test',
  device_token_voip_ios: 'test',
};

export const SignInValidation = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export interface ForgotPasswordInitialValueType {
  email: string;
}

export const ForgotPasswordInitialValue: ForgotPasswordInitialValueType = {
  email: '',
};

export const ForgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .required('Email is required'),
});

export interface SignUpInitialValueType {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  country_code: string;
  login_ip: string;
  role: number;
  device_type: string;
  industry: string;
  location: string;
  bio: string;
  website: string;
  profile_category_type: number;
  interest_id: string;
}

export const SignUpInitialValue: SignUpInitialValueType = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  phone: '1234567890',
  country_code: '+1',
  login_ip: '192.168.1.1',
  role: 3,
  device_type: 'web',
  industry: '',
  location: '',
  bio: '',
  website: '',
  profile_category_type: 2,
  interest_id: '',
};

export const SignUpValidation = Yup.object().shape({
  first_name: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(25, 'First name must not exceed 30 characters')
    .required('First name is required'),

  last_name: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(25, 'Last name must not exceed 30 characters')
    .required('Last name is required'),

  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 20 characters')
    .required('Username is required'),

  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&#]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),

  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export interface OtpVerificationInitialValueType {
  received_otp: string;
}

export const OtpVerificationInitialValue: OtpVerificationInitialValueType = {
  received_otp: '',
};

export const OtpVerificationValidation = Yup.object().shape({
  received_otp: Yup.string().required('OTP is required'),
});
