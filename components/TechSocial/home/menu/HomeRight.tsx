"use client";

import { useState } from "react";
import HomeSubscriptionCard from "../cards/HomeSubscriptionCard";
import Contact from "@/components/common/Contact";
import SidebarFooter from "./Components/SidebarFooter";
import TrendingPosts from "./Components/TrendingPosts";
// import Request from "./Request";

const HomeRight = () => {
  const [activeProfile, setActiveProfile] = useState<boolean>(false);
  const [showTrending, setShowTrending] = useState(true);

  return (
    <div
      className={`cus-overflow cus-scrollbar sidebar-head ${
        activeProfile ? "active" : ""
      }`}
    >
      <div className="d-flex justify-content-end">
        <div className="d-block d-xl-none me-4">
          <button
            className="button toggler-btn mb-4 mb-lg-0 d-flex align-items-center gap-2"
            onClick={() => setActiveProfile(!activeProfile)}
          >
            <span>My List</span>
            <i className="material-symbols-outlined mat-icon"> tune </i>
          </button>
        </div>
      </div>
      <div className="cus-scrollbar side-wrapper">
        <div className="sidebar-wrapper d-flex flex-column gap-6">
          <div className="sidebar-area p-5">
            {/* Request */}
            <HomeSubscriptionCard />
          </div>
          <div className="sidebar-area p-5">
            {/* Contact */}
            <Contact>
              <div className="mb-4">
                <h6 className="d-inline-flex">Who to Follow</h6>
              </div>
            </Contact>
          </div>
          <div className="sidebar-area p-5">
            {/* <TrendingPosts>
              <div className="mb-4 gap-2">
                <h6 className="d-inline-flex">Popular Posts</h6>
                <button className="close-btn">
                  <i className="material-symbols-outlined mat-icon">close</i>
                </button>
              </div>
            </TrendingPosts> */}
            {showTrending ? (
              <TrendingPosts>
                <div className="mb-4 d-flex align-items-center justify-content-between">
                  <h6 className="m-0">Popular Posts</h6>

                  <button
                    className="close-btn"
                    onClick={() => setShowTrending(false)}
                    aria-label="Hide popular posts"
                  >
                    <i className="material-symbols-outlined mat-icon">close</i>
                  </button>
                </div>
              </TrendingPosts>
            ) : (
              <button
                className="button w-100 d-flex align-items-center justify-content-between"
                onClick={() => setShowTrending(true)}
              >
                <h6 className="m-0">Popular Posts</h6>
                <i className="material-symbols-outlined mat-icon">
                  keyboard_arrow_down
                </i>
              </button>
            )}
          </div>
          <div className="p-5">
            <SidebarFooter />
          </div>
          <div className="p-5"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeRight;
