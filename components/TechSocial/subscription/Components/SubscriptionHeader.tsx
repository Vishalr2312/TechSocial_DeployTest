import Link from "next/link";
import React from "react";

const SubscriptionHeader = () => {
  return (
    <>
      <Link href="/" className="close-btn subs-close-btn">
        <i className="material-symbols-outlined mat-icon">close</i>
      </Link>

      <div className="subs-header-content">
        {/* <Image
            src= {logo}
            alt="Plans"
            className="subscription-top-image mb-3"
          /> */}

        <div className="subscription-heading">Choose your Subscription</div>
        <p className="subscription-subtitle">
          Enjoy a premium experience with exclusive tools, priority support,
          enhanced security, and early feature access. <br />
          (For organizations, sign up here)
        </p>
      </div>
    </>
  );
};

export default SubscriptionHeader;
