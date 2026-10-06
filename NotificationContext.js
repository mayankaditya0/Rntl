import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import Toast from "../components/Toast";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const initialLoadRef = useRef({});

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((title, body, type = "default", onClick) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, title, body, type, onClick }]);

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const n = new Notification(title, { body, icon: "/logo192.png" });
        if (onClick) n.onclick = () => { window.focus(); onClick(); };
      } catch (e) { /* mobile browsers may not support constructor */ }
    }
  }, []);

  // Admin: listen for new service enquiries
  useEffect(() => {
    if (!isAdmin) return;
    const key = "serviceEnquiries";
    initialLoadRef.current[key] = true;

    const q = query(collection(db, "serviceEnquiries"), orderBy("createdAt", "desc"), limit(5));
    const unsub = onSnapshot(q, (snap) => {
      if (initialLoadRef.current[key]) { initialLoadRef.current[key] = false; return; }
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const d = change.doc.data();
          notify("New Service Enquiry", `${d.userName || "Someone"} enquired about ${d.serviceType}`, "enquiry");
        }
      });
    });
    return unsub;
  }, [isAdmin, notify]);

  // Admin: listen for new property enquiries
  useEffect(() => {
    if (!isAdmin) return;
    const key = "enquiries";
    initialLoadRef.current[key] = true;

    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"), limit(5));
    const unsub = onSnapshot(q, (snap) => {
      if (initialLoadRef.current[key]) { initialLoadRef.current[key] = false; return; }
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const d = change.doc.data();
          notify("New Property Enquiry", `${d.name || "Someone"} enquired about ${d.propertyTitle}`, "enquiry");
        }
      });
    });
    return unsub;
  }, [isAdmin, notify]);

  // Admin: listen for chats (toast + unread badge)
  useEffect(() => {
    if (!isAdmin) return;
    const key = "adminChats";
    initialLoadRef.current[key] = true;

    const q = query(collection(db, "chats"), orderBy("lastMessageAt", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      setUnreadChatCount(snap.docs.reduce((c, d) => c + (d.data().unreadByAdmin > 0 ? 1 : 0), 0));

      if (initialLoadRef.current[key]) { initialLoadRef.current[key] = false; return; }
      snap.docChanges().forEach((change) => {
        if (change.type === "modified" || change.type === "added") {
          const d = change.doc.data();
          if (d.unreadByAdmin > 0) {
            notify("New Chat Message", `${d.userName || "User"}: ${d.lastMessage}`, "chat");
          }
        }
      });
    });
    return unsub;
  }, [isAdmin, notify]);

  // User: listen for their chat (toast + unread badge)
  useEffect(() => {
    if (!user || isAdmin) return;
    const key = "userChat";
    initialLoadRef.current[key] = true;

    const q = query(collection(db, "chats"), where("userId", "==", user.uid), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setUnreadChatCount(snap.docs[0].data().unreadByUser > 0 ? 1 : 0);
      } else {
        setUnreadChatCount(0);
      }

      if (initialLoadRef.current[key]) { initialLoadRef.current[key] = false; return; }
      snap.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const d = change.doc.data();
          if (d.unreadByUser > 0) {
            notify("Broker Replied", d.lastMessage, "chat");
          }
        }
      });
    });
    return unsub;
  }, [user, isAdmin, notify]);

  return (
    <NotificationContext.Provider value={{ notify, unreadChatCount }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
