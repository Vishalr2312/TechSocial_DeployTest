"use client";

import React from "react";

interface Feature {
  label: string;
  ai_model?: string;
  price?: number;
  type?: "checkbox" | "icon";
  right?: string;
  icon?: string;
}

interface PlanCardProps {
  id: string;
  title: string;
  subtitle: string;
  features: Feature[];
  selected: boolean;
  onSelect: () => void;
  checkedStates?: boolean[];
  onCheckboxChange?: (index: number) => void;
  hideRadio?: boolean;
  radioType?: "radio" | "icon";
}

export default function SubscriptionCard({
  id,
  title,
  subtitle,
  features,
  selected,
  onSelect,
  checkedStates,
  onCheckboxChange,
  hideRadio = false,
  radioType,
}: PlanCardProps) {
  return (
    <div
      className={`subs-plan-card ${selected ? "active" : ""}`}
      onClick={onSelect}
    >
      {/* Title Row */}
      <div className="plan-title-row">
        <div className="plan-title">{title}</div>
        {!hideRadio && (
          <label className="plan-radio">
            {radioType === "icon" ? (
              <button
                type="button"
                className="cmn-btn"
                // style={{ color: "#f05a28", cursor: "pointer" }}
              >
                Chat
              </button> // chat icon for Ad.AI
            ) : (
              <>
                <input
                  type="radio"
                  checked={selected}
                  onChange={onSelect}
                  className="plan-radio-input"
                />
                <span className="custom-radio">✔</span>
              </>
            )}
          </label>
        )}
      </div>

      {/* Subtitle */}
      <div className="plan-subtitle">{subtitle}</div>

      {/* Features */}
      <div className="subs-card-features">
        <ul className="plan-features list-unstyled d-flex flex-column flex-grow-1">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className={`plan-feature d-flex justify-content-between align-items-center ${
                feature.type === "checkbox" ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (feature.type === "checkbox") {
                  onSelect();
                  onCheckboxChange?.(idx);
                }
              }}
            >
              {/* 🔹 Feature label, ai_model + price */}
              <div className="d-flex flex-column">
                <span style={{ color: "#a6acb6" }}>
                  {title === "Ad.AI" && (
                    <span style={{ marginRight: "6px", color: "#f05a28" }}>
                      •
                    </span>
                  )}
                  {feature.label}
                </span>
                {feature.ai_model && (
                  <div className="d-flex gap-2">
                    <span
                      className="secondary-text"
                      style={{ color: "#c0c5cc" }}
                    >
                      {feature.ai_model}
                    </span>
                    {feature.type === "checkbox" &&
                      feature.price !== undefined && (
                        <span
                          className="secondary-text"
                          style={{ color: "#c0c5cc" }}
                        >
                          [${feature.price}]
                        </span>
                      )}
                  </div>
                )}
              </div>

              <span className="plan-feature-right d-flex align-items-center">
                {feature.type === "checkbox" ? (
                  <label
                    className="custom-checkbox ms-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={checkedStates ? checkedStates[idx] : false}
                      onChange={() => {
                        onSelect();
                        onCheckboxChange?.(idx);
                      }}
                    />
                    <span className="checkbox-circle">✔</span>
                  </label>
                ) : feature.type === "icon" ? (
                  <button
                    type="button"
                    className="cmn-btn"
                    // style={{ color: "#f05a28" }}
                  >
                    Chat
                  </button>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
