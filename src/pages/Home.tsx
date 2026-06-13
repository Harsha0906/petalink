import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import backgroundImg from '../../home page/background.png';
import heroImg from '../../home page/hero asset.png';
import stampImg from '../../home page/stamp.png';
import './Home.css';

export const Home: React.FC = () => {
  const { navigateTo } = useApp();
  const [easedScrollY, setEasedScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const scrollRef = useRef({ target: 0, current: 0 });

  useEffect(() => {
    // Trigger entrance animations shortly after component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    scrollRef.current.target = window.scrollY;
    scrollRef.current.current = window.scrollY;
    setEasedScrollY(window.scrollY);

    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let rafId: number;
    const updateScroll = () => {
      const diff = scrollRef.current.target - scrollRef.current.current;
      // Interpolate the scroll value by 10% on each frame for smooth lag/catch-up
      if (Math.abs(diff) > 0.05) {
        scrollRef.current.current += diff * 0.1; // 0.1 easing factor
        setEasedScrollY(scrollRef.current.current);
      } else if (scrollRef.current.current !== scrollRef.current.target) {
        scrollRef.current.current = scrollRef.current.target;
        setEasedScrollY(scrollRef.current.current);
      }
      rafId = requestAnimationFrame(updateScroll);
    };

    rafId = requestAnimationFrame(updateScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Parallax calculations using eased scroll value
  const bouquetY = easedScrollY * 0.15; // Bouquet scrolls slightly slower for parallax depth

  return (
    <div className="home-container">
      {/* Background grids for Frame 1 and Frame 2 */}
      <div className="bg-frame-1" style={{ backgroundImage: `url(${backgroundImg})` }}></div>
      <div className="bg-frame-2" style={{ backgroundImage: `url(${backgroundImg})` }}></div>

      {/* FRAME 1: Hero Section */}
      <section className="section-hero">
        {/* Cat Stamp */}
        <div className={`stamp-wrapper ${isLoaded ? 'animate-fade-in' : ''}`}>
          <img src={stampImg} alt="Stamp" className="stamp-img" />
        </div>

        {/* Brand Title */}
        <div className={`title-wrapper ${isLoaded ? 'animate-slide-down' : ''}`}>
          <h1 className="main-title">
            petalink
          </h1>
          <p className="main-tagline">
            Create<span className="accent-dot">.</span>Personalize<span className="accent-dot">.</span>Gift
          </p>
        </div>

        {/* Center CTA Button */}
        <div className={`cta-wrapper ${isLoaded ? 'animate-fade-in-delayed' : ''}`}>
          <button onClick={() => navigateTo('select')} className="build-button">
            BUILD BOUQUET
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className={`scroll-indicator ${isLoaded ? 'animate-fade-in-delayed' : ''}`}>
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span className="scroll-text">Scroll to explore</span>
        </div>
      </section>

      {/* FRAME 2: Scroll Reveal Section (Ribbon/Wrap/Stems) */}
      <section className="section-reveal">
        <div className="reveal-content">
          <p className="aesthetic-quote">
            "A Bouquet That Carries More Than Flowers"
          </p>
          <p className="aesthetic-desc">
            Design a personalized bouquet using hand-painted flowers. Add hidden messages, photos, songs, and memories to create a gift that feels as meaningful as it looks.
          </p>
        </div>

        <footer className="home-footer">
          <span className="footer-brand">PETALINK</span>
          <span className="footer-credits">Made with 🤍 for digital gifting • © 2026</span>
        </footer>
      </section>

      {/* The Bouquet Hero Asset (Parallax layer positioned relative to scroll container) */}
      <div 
        className="bouquet-hero-wrapper"
        style={{ 
          transform: `translateX(-50%) translateY(${bouquetY}px)`
        }}
      >
        <div className={`bouquet-hero-inner ${isLoaded ? 'animate-rise-up' : ''}`}>
          <img src={heroImg} alt="Beautiful Bouquet" className="bouquet-hero-img" />
        </div>
      </div>
    </div>
  );
};
