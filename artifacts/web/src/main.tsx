import { createRoot } from "react-dom/client";
import { Router, Route, Switch, useLocation } from "wouter";
import { useCallback } from "react";
import Dashboard from "./App";
import "./index.css";

const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function CoverPage() {
  const [, navigate] = useLocation();

  return (
    <div className="cover-page">
      <div className="cover-content">
        <div className="cover-logo-row">
          <span className="cover-ukg">UKG</span>
        </div>
        <h1 className="cover-title">DWO voice experience</h1>
        <div className="cover-buttons">
          <button className="cover-btn cover-btn-desktop" onClick={() => navigate("/desktop")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Desktop
          </button>
          <button className="cover-btn cover-btn-mobile" onClick={() => navigate("/mobile")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Mobile
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileView() {
  const [, navigate] = useLocation();

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="mobile-view-wrapper">
      <button className="mobile-back-btn" onClick={handleBack}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="11,3 5,9 11,15" />
        </svg>
        Back
      </button>
      <div className="iphone-frame">
        <div className="iphone-side-btn iphone-power-btn"></div>
        <div className="iphone-side-btn iphone-vol-up"></div>
        <div className="iphone-side-btn iphone-vol-down"></div>
        <div className="iphone-side-btn iphone-silent-switch"></div>
        <div className="iphone-screen-area">
          <div className="iphone-status-bar">
            <span className="iphone-status-time">9:41</span>
            <div className="iphone-dynamic-island"></div>
            <div className="iphone-status-icons">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M1 4.5C3.3 1.9 6.5.5 8 .5s4.7 1.4 7 4l-1.2 1.2C11.7 3.4 9.7 2.2 8 2.2S4.3 3.4 2.2 5.7L1 4.5z"/><path d="M3.5 7C5 5.3 6.5 4.5 8 4.5s3 .8 4.5 2.5L11.3 8.2C10.1 6.9 9 6.2 8 6.2s-2.1.7-3.3 2L3.5 7z"/><circle cx="8" cy="10.5" r="1.5"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><rect x="1" y="1" width="11" height="10" rx="1.5" stroke="white" strokeWidth="1" fill="none"/><rect x="12.5" y="3.5" width="2" height="5" rx="0.8" fill="white"/><rect x="2.5" y="2.5" width="8" height="7" rx="0.5" fill="white"/></svg>
            </div>
          </div>
          <div className="mobile-device-screen">
            <Dashboard />
          </div>
          <div className="iphone-home-indicator"></div>
        </div>
      </div>
    </div>
  );
}

function DesktopView() {
  const [, navigate] = useLocation();

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="desktop-view-wrapper">
      <button className="desktop-back-btn" onClick={handleBack}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="11,3 5,9 11,15" />
        </svg>
        Back
      </button>
      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <Router base={basePath}>
      <Switch>
        <Route path="/desktop" component={DesktopView} />
        <Route path="/mobile" component={MobileView} />
        <Route path="/" component={CoverPage} />
      </Switch>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
