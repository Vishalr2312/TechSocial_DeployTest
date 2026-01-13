import React from "react";

function HomeSubscriptionCard() {
  return (
    <div>
      <>
        <div className="mb-4">
          <h6 className="d-inline-flex position-relative">
            Subscribe to Premium
          </h6>
        </div>
        <div className="d-grid gap-6">
          {/* Request Card */}
          <span>
            Subscribe to unlock new features and if eligible, receive a share of
            revenue.
          </span>
          <button
            type="button"
            className="cmn-btn align-items-center me-auto"
            onClick={() => {
              window.location.href = "/subscription";
            }}
          >
            Subscribe
          </button>
        </div>
      </>
    </div>
  );
}

export default HomeSubscriptionCard;
