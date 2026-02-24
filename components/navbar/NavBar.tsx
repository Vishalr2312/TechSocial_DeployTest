'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Message from '../common/Message';
import Notification from '../common/Notification';
import Setting from '../common/Setting';
import logo from '/public/images/TechSocial/nav_logo.png';
import { useClickOutside } from '@/Utils/helperFunctions';
import Ts_Notification from '../TechSocial/notifications/Ts_Notification';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import axiosCall from '@/Utils/APIcall';
import { NotificationCollection } from '@/Type/Notification/Ts_Notifications';
import { toast } from 'react-toastify';
import { setNotifications } from '@/Redux/Reducers/Notification/NotificationSlice';
import {
  closeSearchBar,
  setActiveSearchBar,
  setSearchByAi,
  setSearchByPost,
  setSearchByUser,
  setSearchInput,
  setSearchLoading,
} from '@/Redux/Reducers/SearchBarSlice';
import SearchBarResults from '../TechSocial/home/searchBarComp/SearchBarResults';
import LightLoader from '../TechSocial/Loader/LightLoader';

export interface NotificationsApiResponse {
  status: number;
  message: string;
  data: {
    notification: NotificationCollection;
    errors?: any;
  };
}

const NavBar = ({ clss = 'container' }: { clss: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { searchInput, loading } = useAppSelector((state) => state?.searchBar);
  const [windowHeight, setWindowHeight] = useState(0);
  const [active, setActive] = useState<string>('');
  const [activeSearctForm, setActiveSearctForm] = useState(false);

  const navBarTop = () => {
    if (window !== undefined) {
      let height = window.scrollY;
      setWindowHeight(height);
    }
  };

  const activeHandler = (opt: string) => {
    if (opt === active) {
      setActive('');
    } else {
      setActive(opt);
    }
  };

  useEffect(() => {
    dispatch(closeSearchBar());
    dispatch(setSearchLoading(false));
  }, [dispatch]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosCall<NotificationsApiResponse>({
          ENDPOINT: 'notifications?expand=createdByUser,refrenceDetails',
          METHOD: 'GET',
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? 'Unknown error';
          toast.error(firstMessage);
          return;
        }
        const items = response.data.data.notification.items;
        dispatch(setNotifications(items));
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || 'Failed to fetch chat rooms',
        );
      } finally {
      }
    };

    fetchNotifications();
  }, [dispatch]);

  const handleAiSearch = async () => {
    dispatch(setSearchByAi(true));
    dispatch(setSearchLoading(true));
    router.push('/explore-ai');
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchFormData = e.currentTarget as HTMLFormElement;

    const formData = new FormData(searchFormData);
    const data = Object.fromEntries(formData.entries());

    console.log(data);
    dispatch(setSearchInput(''));
    setActiveSearctForm(!activeSearctForm);
  };

  const messageRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(messageRef, () => {
    setActive((prev) => (prev === 'message' ? '' : prev));
  });
  useClickOutside(notificationRef, () => {
    setActive((prev) => (prev === 'notification' ? '' : prev));
  });
  useClickOutside(settingsRef, () => {
    setActive((prev) => (prev === 'settings' ? '' : prev));
  });

  useClickOutside(searchRef, () => {
    dispatch(setActiveSearchBar(false));
    dispatch(setSearchByPost(false));
    dispatch(setSearchByUser(false));
  });

  useEffect(() => {
    window.addEventListener('scroll', navBarTop);
    return () => {
      window.removeEventListener('scroll', navBarTop);
    };
  }, []);

  return (
    <>
      {loading && <LightLoader />}

      <header
        className={`header-section header-menu ${
          windowHeight > 50 && 'animated fadeInDown header-fixed'
        }`}
      >
        <nav className="navbar navbar-expand-lg p-0">
          <div className={clss}>
            <nav className="navbar w-100 navbar-expand-lg justify-content-between">
              <Link href="/" className="navbar-brand">
                <Image src={logo} className="logo img-fluid" alt="logo" />
              </Link>
              <button
                className="button search-active d-block d-md-none"
                onClick={() => setActiveSearctForm(!activeSearctForm)}
              >
                <i className="d-center material-symbols-outlined fs-xxl mat-icon">
                  search
                </i>
              </button>
              <div
                ref={searchRef}
                className={`search-form ${activeSearctForm && 'active'}`}
                onClick={() => dispatch(setActiveSearchBar(true))}
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="input-area d-flex align-items-center"
                  style={{
                    backgroundColor:
                      windowHeight > 50
                        ? 'var(--section-1st-color)'
                        : 'var(--body-color)',
                  }}
                >
                  <input
                    value={searchInput}
                    onChange={(e) => dispatch(setSearchInput(e.target.value))}
                    type="text"
                    name="navbarSearch"
                    placeholder="Search"
                    autoComplete="off"
                  />
                  {/* <i className="material-symbols-outlined mat-icon">search</i> */}
                  <svg
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '6%', cursor: 'pointer' }}
                    onClick={() => handleAiSearch()}
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="28"
                      fill="none"
                      stroke="white"
                      stroke-width="6"
                    />

                    <line
                      x1="60"
                      y1="60"
                      x2="80"
                      y2="80"
                      stroke="white"
                      stroke-width="6"
                      stroke-linecap="round"
                    />

                    <text
                      x="40"
                      y="50"
                      font-family="Arial, sans-serif"
                      font-size="24"
                      font-weight="bold"
                      fill="white"
                      text-anchor="middle"
                    >
                      AI
                    </text>
                  </svg>
                </form>
                <SearchBarResults />
              </div>
              {/* <ul className="navbar-nav feed flex-row gap-xl-20 gap-lg-10 gap-sm-7 gap-3 py-4 py-lg-0 m-lg-auto ms-auto ms-aut align-self-center">
              <li>
                <Link href="/index-two" className="nav-icon home active">
                  <i className="mat-icon fs-xxl material-symbols-outlined mat-icon">
                    home
                  </i>
                </Link>
              </li>
              <li>
                <Link href="/#news-feed" className="nav-icon feed">
                  <i className="mat-icon fs-xxl material-symbols-outlined mat-icon">
                    feed
                  </i>
                </Link>
              </li>
              <li>
                <Link href="/groups" className="nav-icon">
                  <i className="mat-icon fs-xxl material-symbols-outlined mat-icon">
                    group
                  </i>
                </Link>
              </li>
              <li>
                <Link href="#" className="nav-icon">
                  <i className="mat-icon fs-xxl material-symbols-outlined mat-icon">
                    smart_display
                  </i>
                </Link>
              </li>
            </ul> */}
              <div className="right-area position-relative d-flex gap-3 gap-xxl-6 align-items-center">
                {/* <div
                ref={messageRef}
                className={`single-item d-none d-lg-block messages-area ${
                  active === "message" ? "active" : ""
                }`}
              >
                <Message activeHandler={activeHandler} />
              </div> */}
                <div
                  ref={notificationRef}
                  className={`single-item d-none d-lg-block messages-area notification-area ${
                    active === 'notification' ? 'active' : ''
                  }`}
                >
                  {/* Notification */}
                  {/* <Notification activeHandler={activeHandler} /> */}
                  <Ts_Notification activeHandler={activeHandler} />
                </div>
                <div
                  ref={settingsRef}
                  className={`single-item d-none d-lg-block profile-area position-relative ${
                    active === 'settings' ? 'active' : ''
                  }`}
                >
                  {/* Setting */}
                  <Setting activeHandler={activeHandler} />
                </div>
              </div>
            </nav>
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavBar;
