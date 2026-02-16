// "use client";

// import { useEffect } from "react";
// import { getToken, onMessage } from "firebase/messaging";
// import axiosCall from "@/Utils/APIcall";
// import { useAppDispatch } from "@/Redux/hooks";
// import { toast } from "react-toastify";
// import { messaging } from "../firebase";
// import { addNotification } from "@/Redux/Reducers/Notification/NotificationSlice";

// export default function useFCM(userLoggedIn: boolean) {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (!userLoggedIn) return;

//     requestPermissionAndToken();
//     listenForegroundMessages();

//   }, [userLoggedIn]);

//   async function requestPermissionAndToken() {
//     try {
//       const permission = await Notification.requestPermission();
//       if (permission !== "granted") return;

//       const token = await getToken(messaging, {
//         vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//       });

//       if (!token) return;

//       await sendTokenToBackend(token);

//     } catch (err) {
//       console.error("FCM error", err);
//     }
//   }

//   async function sendTokenToBackend(token: string) {
//     await axiosCall({
//       ENDPOINT: "users/update-token",
//       METHOD: "POST",
//       PAYLOAD: {
//         device_type: "web",
//         device_token: token,
//         device_token_voip_ios: "",
//       },
//     });
//   }

//   function listenForegroundMessages() {
//     onMessage(messaging, (payload) => {
//       const data = payload.data;

//       if (!data) return;

//       const notification = {
//         id: Number(data.id || Date.now()),
//         title: data.title,
//         message: data.body,
//         type: Number(data.notification_type),
//         created_at: Number(data.created_at),
//         read_status: 0,
//       };

//       dispatch(addNotification(notification));

//       toast.info(data.title || "New notification");
//     });
//   }
// }
