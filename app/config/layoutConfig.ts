export const layoutConfig: Record<
  string,
  { showNavBar?: boolean; showBottomMenu?: boolean; showScrollToTop?: boolean }
> = {
  default: { showNavBar: true, showBottomMenu: true, showScrollToTop: true },
  '/login': {
    showNavBar: false,
    showBottomMenu: false,
    showScrollToTop: false,
  },
  '/register': {
    showNavBar: false,
    showBottomMenu: false,
    showScrollToTop: false,
  },
  '/subscribe': {
    showNavBar: false,
    showBottomMenu: false,
    showScrollToTop: false,
  },
  '/success': {
    showNavBar: false,
    showBottomMenu: false,
    showScrollToTop: false,
  },
  '/failure': {
    showNavBar: false,
    showBottomMenu: false,
    showScrollToTop: false,
  },
  '/explore-ai': {
    showNavBar: false,
    showBottomMenu: false,
    showScrollToTop: false,
  },
  '/change-password': {
    showNavBar: false,
    showBottomMenu: false,
    showScrollToTop: false,
  },
  '/post': {
    showNavBar: true,
    showBottomMenu: true,
    showScrollToTop: true,
  }
};
