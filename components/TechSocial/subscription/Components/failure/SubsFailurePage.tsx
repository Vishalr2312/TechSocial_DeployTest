import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from '../../../../../public/images/TechSocial/subs_failure.png';

const SubsFailurePage = () => {
  return (
    <div className="subscription-container min-vh-100 container-fluid">
      <Link href="/" className="close-btn subs-close-btn">
        <i className="material-symbols-outlined mat-icon">close</i>
      </Link>

      <div className="subs-header-content">
        <Image className="subs-success-img" src={logo} alt="subscription-failure" />
        <div className="subscription-success-heading">Your Payment has Failed</div>
        <p className="subscription-subtitle">
          Please Re-direct to Home page by clicking the close button
        </p>
      </div>
    </div>
  );
};

export default SubsFailurePage;
