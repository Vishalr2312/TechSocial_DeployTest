"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { toast, ToastContainer } from "react-toastify";
import axiosCall from "@/Utils/APIcall";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import NavBar from "@/components/navbar/NavBar";
import BottomMenu from "@/components/menu/BottomMenu";
import { useAppDispatch } from "@/Redux/hooks";
import { layoutConfig } from "./config/layoutConfig";
import DarkLoader from "@/components/TechSocial/Loader/DarkLoader";
import { SignInResponseInterface } from "@/Type/User/SignInType";
import { signInUser } from "@/Redux/Reducers/UserSlice";
import TsAuthPopups from "@/components/modals/TechSocial/TsAuthPopups";
import TsHomePopups from "@/components/modals/TechSocial/TsHomePopups";
import TsProfilePopups from "@/components/modals/TechSocial/TsProfilePopups";

interface ApiResponse {
  data: SignInResponseInterface;
  success: boolean;
  message: string;
}

const LayoutInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const hasFetchedRef = useRef(false);

  const isLoginPage = pathname === "/login";

  // const config = layoutConfig[pathname] || layoutConfig.default;
  const getLayoutConfig = (pathname: string) => {
    if (layoutConfig[pathname]) {
      return layoutConfig[pathname];
    }

    if (pathname.startsWith("/post/")) {
      return layoutConfig["/post"];
    }

    return layoutConfig.default;
  };

  const config = getLayoutConfig(pathname);

  let clss = "";
  pathname !== "/index-two" ? (clss = "container") : (clss = "container-fluid");

  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      const token = secureLocalStorage.getItem("loginToken");
      if (!isLoginPage && !token) {
        router.push("/login");
        return;
      }
      if (token && isLoginPage) {
        router.push("/");
        return;
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, [pathname, router, isLoginPage]);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoginPage) {
        return;
      }

      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      const token = secureLocalStorage.getItem("loginToken");
      if (!token) return;

      try {
        setLoading(true);
        const response = await axiosCall<ApiResponse>({
          ENDPOINT: "users/profile",
          METHOD: "GET",
        });
        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }
        dispatch(signInUser(response?.data?.data));
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, isLoginPage]);

  const isLoading = authLoading || loading;

  return (
    <>
      {isLoading && <DarkLoader />}
      {config.showScrollToTop && <ScrollToTop />}
      {config.showNavBar && <NavBar clss={clss} />}
      {config.showBottomMenu && <BottomMenu />}
      <TsAuthPopups />
      <TsHomePopups />
      <TsProfilePopups />
      {children}
      <ToastContainer position="top-right" autoClose={1000} theme="dark" />
    </>
  );
};

export default LayoutInitializer;
