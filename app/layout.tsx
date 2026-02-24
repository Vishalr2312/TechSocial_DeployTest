"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// modal video
import "node_modules/react-modal-video/scss/modal-video.scss";

//slick
import "slick-carousel/slick/slick.css";

//custon
import "../styles/globals.scss";
import { layoutConfig } from "./config/layoutConfig";
import Providers from "./Providers";
import LayoutInitializer from "./LayoutInitializer";
import { connectChatSocket } from "@/components/TechSocial/socket/chatSocket";

export default function RootLayout({
  children,
}: {
  Component: any;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const config = layoutConfig[pathname] || layoutConfig.default;
  const [socketReady, setSocketReady] = useState(false);

  let clss = "";
  pathname !== "/index-two" ? (clss = "container") : (clss = "container-fluid");

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    connectChatSocket(() => {
      setSocketReady(true);
    });
  }, []);
  // console.log("🔌 socketReady =", socketReady);

  return (
    <html lang="en">
      <head>
        <meta name="description" content="Circlehub React Nextjs Template" />
        <title>TechSocial</title>
      </head>
      <body>
        <Providers>
          <LayoutInitializer>{children}</LayoutInitializer>
        </Providers>

        {/* <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
        >
          <Loader />
          {config.showScrollToTop && <ScrollToTop />}
          {config.showNavBar && <NavBar clss={clss} />}
          {config.showBottomMenu && <BottomMenu />}
          {children}
          <PostPopups />
        </ThemeProvider> */}
      </body>
    </html>
  );
}
