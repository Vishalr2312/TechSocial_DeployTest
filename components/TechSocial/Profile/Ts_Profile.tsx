"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import Ts_ProfileBanner from "./Components/Ts_ProfileBanner";
import { UserProfile } from "@/Type/Profile/Ts_Profile";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/Redux/hooks";
import { setProfileLoading, setUserProfile } from "@/Redux/Reducers/Profile/ProfileSlice";

export interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
    errors?: any;
  };
}

const Ts_Profile = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchInterestList = async () => {
      try {
        dispatch(setProfileLoading(true));
        const response = await axiosCall<ApiResponse>({
          ENDPOINT:
            "users/profile?expand=totalFollowing,totalFollower,totalActivePost,userLiveDetail,giftSummary,userSetting,interest,language,featureList",
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
          dispatch(setUserProfile(response.data.data.user));
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch interest list"
        );
      } finally {
        dispatch(setProfileLoading(false));
      }
    };

    fetchInterestList();
  }, [dispatch]);

  return (
    <main className="main-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Profile Edit Banner */}
            {/* <ProfileEditBanner /> */}
            <Ts_ProfileBanner />
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

export default Ts_Profile;
