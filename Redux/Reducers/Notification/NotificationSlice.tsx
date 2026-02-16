import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationApiItem } from "@/Type/Notification/Ts_Notifications";
import { getLastSeenNotificationCount } from "@/Utils/notificationHelper";

interface NotificationState {
  items: NotificationApiItem[];
  unreadCount: number;
  lastSeenCount: number;
  loading: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  lastSeenCount: getLastSeenNotificationCount(),
  loading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationApiItem[]>) {
      state.items = action.payload;

      const total = action.payload.length;
      state.unreadCount = Math.max(total - state.lastSeenCount, 0);
    },

    addNotification(state, action: PayloadAction<NotificationApiItem>) {
      state.items.unshift(action.payload);

      const total = state.items.length;
      state.unreadCount = Math.max(total - state.lastSeenCount, 0);
    },

    markAllNotificationsSeen(state) {
      state.lastSeenCount = state.items.length;
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAllNotificationsSeen,
} = notificationSlice.actions;

export default notificationSlice.reducer;
