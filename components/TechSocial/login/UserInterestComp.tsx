"use client";

import { userInterest, UserInterestList } from "@/Type/User/UserType";
import axiosCall from "@/Utils/APIcall";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import DarkLoader from "../Loader/DarkLoader";
import Image from "next/image";

interface ApiResponse {
  data: {
    interest?: UserInterestList;
    errors?: any;
  };
  success: boolean;
  message: string;
}

const UserInterestComp = () => {
  const [loading, setLoading] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<number[]>([]);
  const [interestList, setInterestList] = useState<UserInterestList>([]);
  const [submitting, setSubmitting] = useState(false);

  const didFetchInterestList = useRef(false);

  useEffect(() => {
    if (didFetchInterestList.current) return;
    didFetchInterestList.current = true;

    const fetchInterestList = async () => {
      try {
        setLoading(true);
        const response = await axiosCall<ApiResponse>({
          ENDPOINT: "interests/get-interest",
          METHOD: "GET",
        });
        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }
        setInterestList(response?.data?.data?.interest!);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch interest list"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterestList();
  }, []);

  const { colClasses, gridSizeClass, imageSize } = useMemo(() => {
    const count = interestList.length;

    if (count <= 4) {
      return {
        colClasses: "col-12 col-sm-6 col-lg-3 mb-3 mb-md-4",
        gridSizeClass: "interests-grid--large",
        imageSize: { width: 120, height: 120 },
      };
    } else if (count <= 8) {
      return {
        colClasses: "col-6 col-md-4 col-lg-3 mb-3",
        gridSizeClass: "interests-grid--medium",
        imageSize: { width: 100, height: 100 },
      };
    } else if (count <= 12) {
      return {
        colClasses: "col-6 col-md-4 col-lg-3 col-xl-2 mb-2 mb-md-3",
        gridSizeClass: "interests-grid--small",
        imageSize: { width: 80, height: 80 },
      };
    } else {
      return {
        colClasses: "col-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1-5 mb-2",
        gridSizeClass: "interests-grid--extra-small",
        imageSize: { width: 70, height: 70 },
      };
    }
  }, [interestList.length]);

  const handleSelect = (id: number) => {
    setSelectedInterest((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterest.length === 0) {
      toast.warning("Please select at least one interest.");
      return;
    }

    try {
      setLoading(true);
      setSubmitting(true);
      const payload = { interest_id: selectedInterest.join(",") };
      const response = await axiosCall<ApiResponse>({
        ENDPOINT: "users/update-user-interest",
        METHOD: "POST",
        PAYLOAD: payload,
      });
      if (response?.data?.data?.errors) {
        const errors = response.data.data.errors;
        const firstField = Object.keys(errors)[0] as keyof typeof errors;
        const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
        toast.error(firstMessage);
        return;
      }
      toast.success(response?.data?.message);
      window.location.href = "/";
      setSubmitting(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to verify otp for registration"
      );
    } finally {
      if (window.location.pathname === "/") {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <DarkLoader />}
      <main className="main-content">
        <div className="container">
          <div className="user-interest__header">
            <h2 className="user-interest__header-title">
              Choose Your Interests
            </h2>
            <p className="user-interest__header-subtitle">
              Select the topics that interest you most. You can choose multiple
              options.
            </p>
            <div className="user-interest__header-counter">
              {selectedInterest.length} interest
              {selectedInterest.length > 0 ? "s" : ""} selected
            </div>
          </div>

          {interestList?.length > 0 ? (
            <>
              <div className={`row user-interest__grid ${gridSizeClass}`}>
                {interestList.map((item: userInterest, index) => {
                  const isSelected = selectedInterest.includes(item.id);
                  return (
                    <div className={colClasses} key={item.id}>
                      <div
                        onClick={() => handleSelect(item.id)}
                        className={`user-interest__tile ${
                          isSelected ? "user-interest__tile--selected" : ""
                        } ${
                          gridSizeClass.includes("extra-small")
                            ? "user-interest__tile--small"
                            : ""
                        }`}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(item.id);
                          }
                        }}
                      >
                        {/* <div className="user-interest__image-container">
                          <Image
                            src={item.imageUrl || "#"}
                            alt={item.name}
                            width={imageSize.width}
                            height={imageSize.height}
                            className="rounded-circle"
                            style={{
                              width: `${imageSize.width}px`,
                              height: `${imageSize.height}px`,
                            }}
                          />
                        </div> */}
                        <h6 className="user-interest__name">{item.name}</h6>
                        {isSelected && (
                          <div
                            className="user-interest__checkmark"
                            aria-label="Selected"
                          >
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="user-interest__submit-section ">
                <button
                  onClick={handleSubmit}
                  disabled={selectedInterest.length === 0 || submitting}
                  className="cmn-btn px-2 px-sm-5 px-lg-6"
                  type="button"
                >
                  {submitting ? (
                    <>
                      <span
                        className="user-interest__spinner"
                        role="status"
                        aria-label="Saving"
                      />
                      Saving...
                    </>
                  ) : (
                    `Continue with ${selectedInterest.length || 0} Interest${
                      selectedInterest.length !== 1 ? "s" : ""
                    }`
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="user-interest__empty-state">
              <h5>No interests available</h5>
              <p>Please try again later or contact support.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default UserInterestComp;
