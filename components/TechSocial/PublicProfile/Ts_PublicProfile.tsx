"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/Redux/hooks";
import { UserPublicProfile } from "@/Type/Profile/Ts_PublicProfile";
import {
  setPublicProfileLoading,
  setUserPublicProfile,
} from "@/Redux/Reducers/Profile/PublicProfileSlice";
import Ts_PublicProfileBanner from "./Components/Ts_PublicProfileBanner";

export interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: UserPublicProfile;
    errors?: any;
  };
}

interface TsPublicProfileProps {
  userId: number;
  children: React.ReactNode;
}

const Ts_PublicProfile = ({ userId, children }: TsPublicProfileProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;
    const fetchPublicProfile = async () => {
      try {
        dispatch(setPublicProfileLoading(true));
        const response = await axiosCall<ApiResponse>({
          ENDPOINT: `users/${userId}?expand=totalFollowing,totalFollower,totalActivePost,userLiveDetail,giftSummary,userSetting,interest,language,featureList`,
          METHOD: "GET",
        });
        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }
        if (response?.data?.data?.user) {
          dispatch(setUserPublicProfile(response.data.data.user));
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch interest list",
        );
      } finally {
        dispatch(setPublicProfileLoading(false));
      }
    };

    fetchPublicProfile();
  }, [dispatch, userId]);

  return (
    <main className="main-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Profile Edit Banner */}
            {/* <ProfileEditBanner /> */}
            <Ts_PublicProfileBanner />
          </div>
        </div>
        <div className="row sidebar-toggler">
          {/* content */}
          {children}
        </div>
      </div>
    </main>
  );
};

export default Ts_PublicProfile;
