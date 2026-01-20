"use client";

import Link from "next/link";

const SidebarFooter = () => {
  return (
    <div className="sidebar-footer">
      <div className="footer-links text-muted">
        <Link href="/terms">Terms of Service</Link>
        <span className="seperator">|</span>
        <Link href="/privacy">Privacy Policy</Link>
        <span className="seperator">|</span>
        <Link href="/cookies">Cookie Policy</Link>
        {/* <span>|</span> */}
        {/* <Link href="/accessibility">Accessibility</Link> */}
        {/* <span>|</span> */}
        {/* <Link href="/ads">Ads info</Link> */}
        <div className="footer-copy">
          © {new Date().getFullYear()} TechSocial
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
