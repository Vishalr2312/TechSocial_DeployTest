"use client";

import React, { useEffect, useRef, useState } from "react";
import SubscriptionCard from "./Components/SubscriptionCard";
import SubscriptionHeader from "./Components/SubscriptionHeader";
import DarkLoader from "../Loader/DarkLoader";
import { toast } from "react-toastify";
import {
  SingleAiModelInterface,
  UserSubscribedModelsInterface,
} from "@/Type/Subscription/UserSubscription";
import axiosCall from "@/Utils/APIcall";
import { SubscriptionData } from "@/Type/Subscription/UserSubscriptionStatus";

interface Feature {
  id: number;
  label: string;
  ai_model?: string;
  price?: number;
  type?: "checkbox" | "icon";
}

export interface ApiResponse {
  status: number;
  success: string;
  message: string;
  data: UserSubscribedModelsInterface;
}

export interface SubscriptionStatusResponse {
  status: number;
  success: string;
  message: string;
  data: SubscriptionData;
}

export interface SubscriptionCheckoutResponse {
  status: number;
  success: string;
  message: string;
  data: SubscriptionDataWrapper;
}

export default function SubscriptionPage() {
  const didFetch = useRef(false);

  const [workFeatures, setWorkFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [workChecked, setWorkChecked] = useState<boolean[]>([]);

  // ✅ new state for Ad.AI radio button icon
  const [adSubscribed, setAdSubscribed] = useState(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchWorkFeatures = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch models list
        const response = await axiosCall<ApiResponse>({
          ENDPOINT: "users/get-models-status-list",
          METHOD: "GET",
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(
            errors ?? {}
          )[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }

        const items: SingleAiModelInterface[] =
          response.data?.data?.items || [];
        let features: Feature[] = items.map((item) => ({
          id: item.id,
          label: item.name,
          ai_model: item.ai_model,
          price: parseFloat(item.price),
          type: "checkbox", // default
        }));

        // 2️⃣ Fetch subscription status
        const res = await axiosCall<SubscriptionStatusResponse>({
          ENDPOINT: "users/get-subscription-status",
          METHOD: "POST",
        });

        if (res?.data?.data?.errors) {
          const errors = res.data.data.errors;
          const firstField = Object.keys(
            errors ?? {}
          )[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }

        const subscriptionData = res.data?.data;

        // ✅ Handle Work.AI subscriptions
        const workAiSubscriptions =
          subscriptionData?.work_ai?.subscriptions ?? [];

        const subscribedModelIds = new Set(
          workAiSubscriptions
            .filter((sub) => sub.status === "active" && !sub.expired)
            .map((sub) => sub.ai_model_id)
        );

        features = features.map((feature, index) => {
          const model = items[index];
          if (subscribedModelIds.has(model.id)) {
            return { ...feature, type: "icon" }; // chat icon
          }
          return feature;
        });

        setWorkFeatures(features);
        setWorkChecked(features.map(() => false));

        // ✅ Handle Ad.AI subscription
        if (subscriptionData?.ad_ai?.hasSubscription) {
          const isAdSubscribed =
            subscriptionData.ad_ai.expired === false &&
            subscriptionData.ad_ai.subscription?.status === "active";
          setAdSubscribed(isAdSubscribed);
        }
      } catch (err) {
        toast.error(`Failed to fetch subscription data ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkFeatures();
  }, []);

  const plans = [
    {
      id: "ad",
      title: "Ad.AI",
      subtitle: "Features",
      features: [
        { label: "Verified check mark (✔️)" },
        { label: "Longer posts upto (1000) characters" },
        {
          label:
            "AI search 🔎 on content for texts, links, & images upto 500 searches /month",
        },
        { label: "More optimised timeline based on preferences" },
        { label: "Early access to new features" },
        { label: "Real time access to preferred topics" },
        { label: "Reduction in Ads" },
        { label: "Reply boost highest" },
      ],
      hideRadio: false,
      radioType: adSubscribed ? ("icon" as "icon") : ("radio" as "radio"),
    },
    {
      id: "work",
      title: "Work.AI",
      subtitle: "AI Models",
      features: workFeatures,
      hideRadio: true, // never show radio for Work.AI
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<string>("ad");

  const handleCheckboxChange = (index: number) => {
    setWorkChecked((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });

    setSelectedPlan("work");
  };

  const handleSelectPlan = (id: string) => {
    setSelectedPlan(id);
    if (id === "ad") {
      setWorkChecked(workFeatures.map(() => false));
    }
  };

  const getTotalPrice = () => {
    if (selectedPlan === "ad") return 7.99;
    return workChecked.reduce((total, checked, index) => {
      if (checked) return total + (workFeatures[index]?.price || 0);
      return total;
    }, 0);
  };

  return (
    <>
      {loading && <DarkLoader />}
      <div className="subscription-container container-fluid">
        <SubscriptionHeader />

        {/* Plan Cards */}
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              id={plan.id}
              title={plan.title}
              subtitle={plan.subtitle}
              features={plan.features}
              selected={selectedPlan === plan.id}
              onSelect={() => handleSelectPlan(plan.id)}
              checkedStates={plan.id === "work" ? workChecked : undefined}
              onCheckboxChange={
                plan.id === "work" ? handleCheckboxChange : undefined
              }
              hideRadio={plan.hideRadio} // hide radio if already subscribed
              radioType={plan.radioType} // tell SubscriptionCard to show chat icon instead of radio
            />
          ))}
        </div>

        {/* CTA Button */}
        {/* <div className="text-center mt-10">
          <button className="subscribe-btn fourth">
            {adSubscribed && selectedPlan === "ad"
              ? "Subscription Active"
              : `Pay $${getTotalPrice()} and Subscribe`}
          </button>
        </div> */}
        <div className="text-center mt-10">
          <button
            className="subscribe-btn fourth"
            onClick={async () => {
              if (loading) return;

              try {
                setLoading(true);

                if (selectedPlan === "ad" && !adSubscribed) {
                  // ✅ Ad.AI subscription
                  const res = await axiosCall<SubscriptionCheckoutResponse>({
                    ENDPOINT: "users/subscribe-user-checkout",
                    METHOD: "POST",
                    PAYLOAD: {
                      type: "ad_ai",
                      isRecurring: false,
                    },
                  });
                  if (res?.data?.data?.errors) {
                    const errors = res.data.data.errors;
                    const firstField = Object.keys(
                      errors ?? {}
                    )[0] as keyof typeof errors;
                    const firstMessage =
                      errors[firstField]?.[0] ?? "Unknown error";
                    toast.error(firstMessage);
                    return;
                  }

                  const checkoutUrl = res.data?.data?.data?.checkoutUrl;
                  if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                  } else {
                    toast.error("Checkout URL not found");
                  }
                } else if (selectedPlan === "work") {
                  // ✅ Work.AI subscription
                  const selectedModelIds = workChecked
                    .map((checked, index) =>
                      checked ? workFeatures[index]?.id : null
                    )
                    .filter(Boolean);

                  if (selectedModelIds.length > 0) {
                    const res = await axiosCall<SubscriptionCheckoutResponse>({
                      ENDPOINT: "users/subscribe-user-checkout",
                      METHOD: "POST",
                      PAYLOAD: {
                        type: "work_ai",
                        modelIds: selectedModelIds,
                        isRecurring: false,
                      },
                    });
                    if (res?.data?.data?.errors) {
                      const errors = res.data.data.errors;
                      const firstField = Object.keys(
                        errors ?? {}
                      )[0] as keyof typeof errors;
                      const firstMessage =
                        errors[firstField]?.[0] ?? "Unknown error";
                      toast.error(firstMessage);
                      return;
                    }

                    const checkoutUrl = res.data?.data?.data?.checkoutUrl;
                    if (checkoutUrl) {
                      window.location.href = checkoutUrl;
                    } else {
                      toast.error("Checkout URL not found");
                    }
                  }
                } else {
                  toast.info("No subscription selected or already active");
                }
              } catch (err) {
                toast.error("Failed to initiate subscription");
              } finally {
                setLoading(false);
              }
            }}
          >
            {selectedPlan === "work" && workChecked.every((checked) => !checked)
              ? "Select at least one model to proceed"
              : adSubscribed && selectedPlan === "ad"
              ? "Subscription Active"
              : `Pay $${getTotalPrice()} and Subscribe`}
          </button>
        </div>
      </div>
    </>
  );
}
