import React from "react";

function HomeSubscriptionCard() {
  return (
    <div>
      <>
        <div className="mb-4">
          {/* <h6 className="d-inline-flex position-relative">
            Subscribe to Premium
          </h6> */}
          <h6 className="d-inline-flex position-relative">Unlock AI Power</h6>
        </div>
        <div className="d-grid">
          {/* Request Card */}
          {/* <span>
            Subscribe to unlock new features and if eligible, receive a share of
            revenue.
          </span> */}
          <div className="d-flex flex-column gap-3 mb-4">
            <div className="d-flex gap-2 align-items-start">
              {/* <span className="fs-5">🎯</span> */}
              <div className="gap-7">
                <h6>Ad.AI</h6>
                <p className="small m-0">
                  Grow faster. Reach further. Boost reach & visibility.
                </p>
              </div>
            </div>

            <div className="d-flex gap-2 align-items-start">
              {/* <span className="fs-5">⚙️</span> */}
              <div>
                <h6>Work.AI</h6>
                <p className="small m-0">
                  Automate Work. Build faster. Save hours.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="cmn-btn align-items-center me-auto"
            onClick={() => {
              window.location.href = "/subscription";
            }}
          >
            Explore AI Plans
          </button>
        </div>
      </>
    </div>
  );
}

export default HomeSubscriptionCard;
