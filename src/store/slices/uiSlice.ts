// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState, Notification } from "@/types";

const initialState: UIState = {
  isMobileMenuOpen: false,
  isCartOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },

    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },

    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id">>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.isVisible = false;
      }
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    showSuccessNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: "success",
        message: action.payload,
        isVisible: true,
        autoHide: true,
        duration: 5000,
      };
      state.notifications.push(notification);
    },

    showErrorNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: "error",
        message: action.payload,
        isVisible: true,
        autoHide: true,
        duration: 7000,
      };
      state.notifications.push(notification);
    },

    showInfoNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: "info",
        message: action.payload,
        isVisible: true,
        autoHide: true,
        duration: 5000,
      };
      state.notifications.push(notification);
    },

    showWarningNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: "warning",
        message: action.payload,
        isVisible: true,
        autoHide: true,
        duration: 6000,
      };
      state.notifications.push(notification);
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  openMobileMenu,
  toggleCart,
  closeCart,
  openCart,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearNotifications,
  showSuccessNotification,
  showErrorNotification,
  showInfoNotification,
  showWarningNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
