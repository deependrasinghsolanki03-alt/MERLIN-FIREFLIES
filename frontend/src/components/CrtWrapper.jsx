import React, { useState } from 'react';
import '../styles/frontpage.css';

export default function CrtWrapper({ children }) {
  const [isDiscOut, setIsDiscOut] = useState(false);
  const [isCrtActive, setIsCrtActive] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleSlideOut = () => {
    setIsDiscOut(true);
  };

  const handleDiscClick = () => {
    if (!isDiscOut) return;
    setIsCrtActive(true);
    setIsShuttingDown(false);
  };

  const handlePowerDown = () => {
    setIsShuttingDown(true);
    setTimeout(() => {
      setIsCrtActive(false);
      setIsDiscOut(false);
      setIsShuttingDown(false);
    }, 800);
  };

  return (
    <div className="crt-wrapper">
      {/* Sunset Gradient Background */}
      <div className="bg-sunset-synth"></div>

      {/* Twinkling Stars */}
      <div className="fx-stars"></div>

      {/* Shooting Stars */}
      <div className="fx-shooting-stars">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>

      {/* Drifting Pixel Clouds */}
      <div className="fx-clouds">
        <div className="pixel-cloud"></div>
        <div className="pixel-cloud cloud-sm"></div>
        <div className="pixel-cloud"></div>
        <div className="pixel-cloud cloud-sm"></div>
        <div className="pixel-cloud cloud-sm"></div>
      </div>

      {/* ===== PHASE 1: DVD STAGE ===== */}
      <main className="dvd-stage" id="dvdStage">
        <h1 className="typography-title">MERLIN'S WISDOM</h1>

        <div className="dvd-container">
          {/* Hidden Disc (behind sleeve) */}
          <div 
            className={`dvd-disc ${isDiscOut ? 'slide-out' : ''}`} 
            id="dvdDisc" 
            title="Play Disc"
            onClick={handleDiscClick}
          ></div>

          {/* Sleeve on top */}
          <div 
            className="dvd-sleeve" 
            id="dvdSleeve" 
            title="Open Sleeve"
            onClick={handleSlideOut}
          >
            <div className="dvd-label">
              Merlin's<br/>TALK<br/><br/><span style={{fontSize: '0.55rem'}}>v 2.0</span>
            </div>
          </div>
        </div>

        <button 
          className="btn-pixel" 
          id="btnPlayDemo"
          onClick={handleSlideOut}
        >
          PLAY DEMO
        </button>
      </main>

      {/* ===== PHASE 2: CRT TV MODAL ===== */}
      <div className={`crt-modal ${isCrtActive ? 'active' : ''}`} id="crtModal">
        <div className={`crt-tv ${isShuttingDown ? 'crt-shutdown' : ''}`} id="crtTv">

          {/* Channel indicator */}
          <div className="tv-channel">CH Merlin</div>

          {/* The Screen */}
          <div className="crt-screen-container" id="crtScreen">

            {/* React App Wrapper */}
            <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 4, background: 'transparent' }}>
              {isCrtActive && children}
            </div>

            {/* CRT Overlays */}
            <div className="fx-scanlines"></div>
            <div className="fx-crt-flicker"></div>
          </div>

          {/* Bezel elements */}
          <span className="tv-brand">MERLIN</span>
          <div 
            className="tv-power-btn" 
            id="btnPower" 
            title="Shut Down"
            onClick={handlePowerDown}
          ></div>
        </div>
      </div>
    </div>
  );
}
