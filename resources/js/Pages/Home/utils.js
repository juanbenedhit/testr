// utils.js

import { Low, Medium, High } from "./components/Icons";

// Fungsi untuk mengekstrak ikon berdasarkan prioritas
export const extractPriority = (priority) => {
    switch (priority) {
        case "low":
            return <Low />;
        case "medium":
            return <Medium />;
        case "high":
            return <High />;
        default:
            return null;
    }
};

// Fungsi debounce untuk mengurangi frekuensi panggilan fungsi
export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
};
