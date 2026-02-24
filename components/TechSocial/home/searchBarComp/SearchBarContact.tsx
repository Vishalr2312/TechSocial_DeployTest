'use client';

import contentData from '@/data/contentData';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import avatar_6 from '/public/images/avatar-6.png';
import { UserList } from '@/Type/SearchUsers/SearchUsers';
import axiosCall from '@/Utils/APIcall';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { toggleFollow } from '@/Redux/Reducers/PostFeeds/PostSlice';
import { setFollowStatus } from '@/Redux/Reducers/UserSlice';
import SingleContact from '@/components/common/SingleContact';
import {
  setSearchLoading,
  setSearchResults,
} from '@/Redux/Reducers/SearchBarSlice';
// import DarkLoader from "../TechSocial/Loader/DarkLoader";

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: UserList[];
    errors?: any;
  };
}

interface FollowUnfollowApiResponse {
  status: number;
  message: string;
  data: [];
}

interface ContactProps {
  children: React.ReactNode;
  isSearchBar?: boolean;
}

const SearchBarContact = ({ children, isSearchBar }: ContactProps) => {
  const dispatch = useAppDispatch();
  const { searchByUser, searchInput, activeSearchBar, loading, results } =
    useAppSelector((state) => state.searchBar);
  const pathname = usePathname();
  const router = useRouter();
  const followStatus = useAppSelector((state) => state.user.followStatus);

  useEffect(() => {
    if (!searchByUser || searchInput.trim().length <= 2) {
      return;
    }

    const fetchUsers = async () => {
      try {
        dispatch(setSearchLoading(true));

        const payload = {
          name: searchInput.trim(),
        };

        const response = await axiosCall<ApiResponse>({
          ENDPOINT: 'users/search-user?expand=totalActivePost',
          METHOD: 'POST',
          PAYLOAD: payload,
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? 'Unknown error';
          toast.error(firstMessage);
          return;
        }

        const users = response?.data?.data?.user;

        if (!users || users.length === 0) {
          console.log('No users found in response');
          dispatch(setSearchResults([]));
          return;
        }

        const sortedUsers = [...users].sort(
          (a, b) => (b.totalActivePost ?? 0) - (a.totalActivePost ?? 0),
        );

        dispatch(setSearchResults(sortedUsers.slice(0, 5)));
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to fetch users');
      } finally {
        dispatch(setSearchLoading(false));
      }
    };

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchInput, searchByUser]);

  const followUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: 'followers',
      METHOD: 'POST',
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const unfollowUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: 'followers/unfollow',
      METHOD: 'POST',
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const handleFollowToggle = async (
    userId: number,
    initialIsFollowing: number,
  ) => {
    const currentStatus = followStatus[userId] ?? initialIsFollowing === 1;
    dispatch(
      setFollowStatus({
        userId,
        isFollowing: !currentStatus,
      }),
    );

    try {
      if (currentStatus) {
        await unfollowUserApi(userId);
        toast.success('Unfollowed');
        router.refresh();
      } else {
        await followUserApi(userId);
        toast.success('Followed');
        router.refresh();
      }
      // router.refresh();
    } catch (error: any) {
      dispatch(
        setFollowStatus({
          userId,
          isFollowing: currentStatus,
        }),
      );

      toast.error(
        error?.response?.data?.message || 'Failed to update follow status',
      );
    } finally {
    }
  };

  return (
    <>
      {/* children props */}
      {children}

      <div className="d-flex flex-column gap-6">
        {results.map((user: any) => (
          <div
            key={user.id}
            className="profile-area d-center position-relative align-items-center justify-content-between"
          >
            <SingleContact
              data={user}
              onFollowToggle={handleFollowToggle}
              isSearchBar
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchBarContact;
