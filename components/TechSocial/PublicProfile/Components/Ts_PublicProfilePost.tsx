"use client";

import Photos from "@/components/marketplacePost/Photos";
import { useAppSelector } from "@/Redux/hooks";
import Link from "next/link";
import Contact from "@/components/common/Contact";
import SidebarFooter from "../../home/menu/Components/SidebarFooter";
import Ts_ProfilePostFeeds from "../../Profile/Components/Posts/Ts_ProfilePostFeeds";

interface BioItem {
  id: number;
  type: string;
  icon: string;
  class: string;
}

const Ts_PublicProfilePost = () => {
  const user = useAppSelector((state) => state.publicProfile.user);

  const bioData: BioItem[] = [
    user?.email
      ? { id: 1, type: user.email, icon: "mail", class: "link" }
      : null,

    // user?.phone ? { id: 2, type: user.phone, icon: "call", class: "" } : null,

    user?.website
      ? { id: 3, type: user.website, icon: "language", class: "link" }
      : null,

    user?.industry
      ? {
          id: 4,
          type: user.industry,
          icon: "location_city",
          class: "",
        }
      : null,

    user?.city || user?.country
      ? {
          id: 5,
          type: [user?.city, user?.country].filter(Boolean).join(", "),
          icon: "pin_drop",
          class: "",
        }
      : null,
  ].filter((item): item is BioItem => item !== null);
  // console.log("User in Ts_PublicProfilePost:", user);
  return (
    <>
      <div className="col-xxl-3 col-xl-3 col-lg-4 col-6 cus-z2">
        <div className="d-inline-block d-lg-none">
          <button className="button profile-active mb-4 mb-lg-0 d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon"> tune </i>
            <span>My profile</span>
          </button>
        </div>
        <div className="profile-sidebar cus-scrollbar max-width p-5">
          <div className="d-block d-lg-none position-absolute end-0 top-0">
            <button className="button profile-close">
              <i className="material-symbols-outlined mat-icon fs-xl">close</i>
            </button>
          </div>
          <div className="sidebar-area">
            <div className="mb-3">
              <h6 className="d-inline-flex">About</h6>
            </div>
            <p className="mdtxt descript">{user?.bio || "No bio added yet."}</p>
            {/* <Link
              href="#"
              className="cmn-btn w-100 mt-5 alt third d-center gap-1"
            >
              <i className="material-symbols-outlined mat-icon fs-2">
                edit_note
              </i>
              Edit Bio
            </Link> */}
          </div>
          <div className="sidebar-area mt-5">
            <div className="mb-2">
              <h6 className="d-inline-flex">Info</h6>
            </div>
            <ul className="d-grid gap-2 mt-4">
              {bioData.map((itm) => (
                <li key={itm.id} className="d-flex align-items-center gap-2">
                  <i className="material-symbols-outlined mat-icon">
                    {itm.icon}
                  </i>
                  <span className={`mdtxt ${itm.class}`}>{itm.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-xxl-6 col-xl-5 col-lg-8 mt-0 mt-lg-10 mt-xl-0 d-flex flex-column gap-7 cus-z">
        {/* Make Post */}
        {/* <MakePost /> */}

        {/* Feeds */}
        <Ts_ProfilePostFeeds clss="p-3 p-sm-5" />
      </div>
      <div className="col-xxl-3 col-xl-4 col-lg-4 col-6 mt-5 mt-xl-0">
        <div className="cus-overflow cus-scrollbar sidebar-head">
          <div className="d-flex justify-content-end">
            <div className="d-block d-xl-none me-4">
              <button className="button toggler-btn mb-4 mb-lg-0 d-flex align-items-center gap-2">
                <span>My List</span>
                <i className="material-symbols-outlined mat-icon"> tune </i>
              </button>
            </div>
          </div>
          <div className="cus-scrollbar side-wrapper">
            <div className="sidebar-wrapper d-flex flex-column gap-6 max-width">
              {/* <div className="sidebar-area post-item p-5">
                <Photos />
              </div> */}
              <div className="sidebar-area p-5">
                {/* Contact */}
                <Contact>
                  <div className="mb-4">
                    <h6 className="d-inline-flex">You might like</h6>
                  </div>
                </Contact>
              </div>
              <div className="p-5">
                <SidebarFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ts_PublicProfilePost;
