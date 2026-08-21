import { useEffect, useState } from "react";

// Shows a floating "back to top" button once the page has been scrolled
// down past `threshold` pixels, and hides it again near the top — so it
// doesn't clutter the view on short pages or right when you land here.
function ScrollToTopButton({ threshold = 320 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`scroll-top-btn ${visible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

export default ScrollToTopButton;
