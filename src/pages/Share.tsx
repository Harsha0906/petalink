import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import backgroundImg from '../../home page/background.png';
import { ArrowLeft, Copy, Check, Sparkles, Share2 } from 'lucide-react';
import './Share.css';

// Import Wrap Assets
import classicBack from '../../classic wrap/classic_back.png';
import classicFront from '../../classic wrap/classic_front.png';

// Import Greenery Assets
import babyBreath from '../../greenery/baby_s_breath.png';
import waxFlower from '../../greenery/wax_Flower.png';
import largeEucalyptus from '../../greenery/eucalyptus/large_eucalyptus.png';
import mediumEucalyptus from '../../greenery/eucalyptus/medium_eucalyptus.png';
import smallEucalyptus from '../../greenery/eucalyptus/small_eucalyptus.png';

interface BotanicalProps {
  baseScale: number;
}

const BOTANICAL_DATABASE: Record<string, BotanicalProps> = {
  rose: { baseScale: 1.1 },
  lilies: { baseScale: 1.25 },
  tulip: { baseScale: 1.0 },
  sunflower: { baseScale: 1.35 },
  peony: { baseScale: 1.3 },
  daisy: { baseScale: 0.95 },
  ranunculus: { baseScale: 1.05 }
};

const getSeededRandom = (seed: number, key: string): number => {
  let hash = 0;
  const str = seed.toString() + key;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

export const Share: React.FC = () => {
  const {
    selectedFlowers,
    reshuffleSeed,
    shareCode,
    navigateTo,
    clearSelection,
    availableFlowers
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [curtainFlowers, setCurtainFlowers] = useState<{ id: number; image: string; left: number; delay: number; scale: number; speed: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const count = selectedFlowers.length;

  const shareUrl = shareCode
    ? `${window.location.origin}${window.location.pathname}?b=${shareCode}`
    : '';

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PETALINK Digital Bouquet',
          text: 'I created a personalized digital bouquet with a hidden message for you! 🌸✨',
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  const handleStartNew = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Generate 35 falling flowers for a rich curtain effect
    const flowersList = [];
    for (let i = 0; i < 35; i++) {
      const randomFlower = availableFlowers[Math.floor(Math.random() * availableFlowers.length)];
      flowersList.push({
        id: i,
        image: randomFlower.image,
        left: Math.random() * 95, // keep slightly within viewport bounds
        delay: Math.random() * 0.9, // Stagger delays up to 0.9s
        scale: 0.6 + Math.random() * 0.6, // Scale between 0.6 and 1.2
        speed: 1.5 + Math.random() * 0.8 // Animation duration between 1.5s and 2.3s
      });
    }
    setCurtainFlowers(flowersList);

    // After 2.3s (when all flowers have completed their fall), redirect to home
    setTimeout(() => {
      clearSelection();
      navigateTo('home');
    }, 2300);
  };

  // Botanical slot positions (scaled down preview of Page 3 arrangement)
  const getFlowerSlots = (flowerCount: number) => {
    switch (flowerCount) {
      case 4:
        return [
          { x: 50, y: 22, zIndex: 21 },
          { x: 33, y: 32, zIndex: 22 },
          { x: 67, y: 32, zIndex: 23 },
          { x: 50, y: 41, zIndex: 24 }
        ];
      case 5:
        return [
          { x: 50, y: 31, zIndex: 20 },
          { x: 34, y: 23, zIndex: 21 },
          { x: 66, y: 23, zIndex: 22 },
          { x: 36, y: 39, zIndex: 23 },
          { x: 64, y: 39, zIndex: 24 }
        ];
      case 6:
        return [
          { x: 44, y: 24, zIndex: 20 },
          { x: 56, y: 24, zIndex: 21 },
          { x: 32, y: 33, zIndex: 22 },
          { x: 68, y: 33, zIndex: 23 },
          { x: 42, y: 42, zIndex: 24 },
          { x: 58, y: 42, zIndex: 25 }
        ];
      case 7:
        return [
          { x: 50, y: 31, zIndex: 23 },
          { x: 50, y: 19, zIndex: 20 },
          { x: 33, y: 23, zIndex: 21 },
          { x: 67, y: 23, zIndex: 22 },
          { x: 50, y: 42, zIndex: 26 },
          { x: 35, y: 38, zIndex: 24 },
          { x: 65, y: 38, zIndex: 25 }
        ];
      case 8:
      default:
        return [
          { x: 50, y: 31, zIndex: 23 },
          { x: 35, y: 29, zIndex: 21 },
          { x: 65, y: 29, zIndex: 22 },
          { x: 50, y: 19, zIndex: 20 },
          { x: 30, y: 21, zIndex: 19 },
          { x: 70, y: 21, zIndex: 18 },
          { x: 38, y: 42, zIndex: 24 },
          { x: 62, y: 42, zIndex: 25 }
        ];
    }
  };

  const getGreeneryElements = (flowerCount: number) => {
    const allGreenery = [
      { id: 'large-euc-l', type: 'large-euc', x: 32, y: 24, rotation: -20, zIndex: 11, scale: 0.9 },
      { id: 'large-euc-r', type: 'large-euc', x: 68, y: 24, rotation: 20, zIndex: 10, scale: 0.9 },
      { id: 'baby-breath-c', type: 'baby-breath', x: 50, y: 15, rotation: 0, zIndex: 12, scale: 0.8 },
      { id: 'med-euc-l', type: 'med-euc', x: 26, y: 34, rotation: -35, zIndex: 9, scale: 0.9 },
      { id: 'med-euc-r', type: 'med-euc', x: 74, y: 34, rotation: 35, zIndex: 8, scale: 0.9 },
      { id: 'baby-breath-l', type: 'baby-breath', x: 36, y: 17, rotation: -10, zIndex: 13, scale: 0.85 },
      { id: 'baby-breath-r', type: 'baby-breath', x: 64, y: 17, rotation: 10, zIndex: 14, scale: 0.85 },
      { id: 'wax-l', type: 'wax', x: 31, y: 39, rotation: -12, zIndex: 15, scale: 0.95 },
      { id: 'wax-r', type: 'wax', x: 69, y: 39, rotation: 12, zIndex: 16, scale: 0.95 }
    ];
    if (flowerCount === 4) return allGreenery;
    else if (flowerCount <= 6) return allGreenery.slice(0, 7);
    else return allGreenery.slice(0, 5);
  };

  const getGreeneryAsset = (type: string) => {
    switch (type) {
      case 'large-euc': return largeEucalyptus;
      case 'med-euc': return mediumEucalyptus;
      case 'baby-breath': return babyBreath;
      case 'wax': return waxFlower;
      default: return smallEucalyptus;
    }
  };

  const flowerSlots = getFlowerSlots(count);
  const activeGreenery = getGreeneryElements(count);

  return (
    <div className="share-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      {/* Curtain Overlay */}
      {curtainFlowers.length > 0 && (
        <div className="flower-curtain-overlay">
          {curtainFlowers.map(f => (
            <img
              key={f.id}
              src={f.image}
              alt=""
              className="falling-curtain-flower"
              style={{
                left: `${f.left}%`,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.speed}s`,
                transform: `scale(${f.scale})`
              }}
            />
          ))}
        </div>
      )}
      {/* Header */}
      <header className="share-header">
        <button onClick={() => navigateTo('personalize')} className="back-btn-glass">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="logo-tiny-share">petalink</div>
        <div style={{ width: '80px' }}></div>
      </header>

      <main className="share-main">
        <div className="share-layout-grid">
          {/* Column 1: Bouquet Preview */}
          <div className="share-col-preview">
            <div className="share-bouquet-container">
              <div className="share-bouquet-canvas">
                <img src={classicBack} alt="" className="share-wrap-layer back" />
                
                {activeGreenery.map(green => {
                  const randAngle = (getSeededRandom(reshuffleSeed, green.id + '-rot') * 16) - 8;
                  const randX = (getSeededRandom(reshuffleSeed, green.id + '-x') * 8) - 4;
                  const randY = (getSeededRandom(reshuffleSeed, green.id + '-y') * 8) - 4;
                  return (
                    <img
                      key={green.id}
                      src={getGreeneryAsset(green.type)}
                      alt=""
                      className="share-greenery-asset"
                      style={{
                        left: `${green.x + randX}%`,
                        top: `${green.y + randY}%`,
                        transform: `translate(-50%, -50%) rotate(${green.rotation + randAngle}deg) scale(${green.scale})`,
                        zIndex: green.zIndex
                      }}
                    />
                  );
                })}

                {selectedFlowers.map((flower, idx) => {
                  const slot = flowerSlots[idx] || flowerSlots[0];
                  const botanical = BOTANICAL_DATABASE[flower.id] || { baseScale: 1.0 };
                  const randAngle = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-rot') * 30) - 15;
                  const randX = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-x') * 6) - 3;
                  const randY = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-y') * 6) - 3;
                  const randScale = 0.95 + (getSeededRandom(reshuffleSeed, flower.uniqueId + '-scale') * 0.1);
                  const scale = botanical.baseScale * randScale;

                  return (
                    <div
                      key={flower.uniqueId}
                      className="share-flower-wrapper"
                      style={{
                        left: `${slot.x + randX}%`,
                        top: `${slot.y + randY}%`,
                        zIndex: slot.zIndex,
                        transform: `translate(-50%, -50%) rotate(${randAngle}deg) scale(${scale})`
                      }}
                    >
                      <img src={flower.image} alt="" className="share-flower-img" />
                    </div>
                  );
                })}

                <img src={classicFront} alt="" className="share-wrap-layer front" />
              </div>
            </div>
          </div>

          {/* Column 2: Share Links Card */}
          <div className="share-col-content">
            <div className="share-success-card glass-card">
              <div className="share-success-icon-wrapper">
                <Sparkles className="share-success-icon" size={32} />
              </div>
              <h1 className="share-success-title">Bouquet Created!</h1>
              <p className="share-success-subtitle">
                Your digital bouquet is ready to gift. Copy the link below and send it to your recipient!
              </p>

              <div className="share-link-box">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="share-link-input"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopy}
                  className={`share-copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="share-action-buttons">
                {isShareSupported && (
                  <button onClick={handleShare} className="share-btn-primary">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                )}
                <button onClick={handleStartNew} className="share-btn-secondary">
                  Create Another Bouquet
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
