export const getLastSeenNotificationCount = () => {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("last_seen_notification_count") || 0);
};

export const setLastSeenNotificationCount = (count: number) => {
  localStorage.setItem("last_seen_notification_count", String(count));
};
