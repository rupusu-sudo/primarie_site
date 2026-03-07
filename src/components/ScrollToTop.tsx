import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the viewport to the top (or to the in-page anchor) on route changes.
 * Keeps behavior smooth and lightweight for both desktop and mobile.
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // If navigating to a hash, attempt to scroll that element into view.
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    // Default: scroll to page top.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
