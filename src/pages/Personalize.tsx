import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import backgroundImg from '../../home page/background.png';
import { ArrowLeft, Sparkles, Link } from 'lucide-react';
import './Personalize.css';

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

export const Personalize: React.FC = () => {
  const {
    selectedFlowers,
    personalNote,
    setPersonalNote,
    reshuffleSeed,
    navigateTo,
    generateShareCode,
    updateFlowerLink
  } = useApp();

  const [activeLinkFlowerId, setActiveLinkFlowerId] = useState<string | null>(null);
  const count = selectedFlowers.length;

  const handleNoteChange = (field: 'to' | 'from' | 'message', value: string) => {
    setPersonalNote({
      ...personalNote,
      [field]: value
    });
  };

  const handleProceed = () => {
    generateShareCode();
    navigateTo('share');
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveLinkFlowerId(null);
    }
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
    <div className="personalize-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      {/* Header */}
      <header className="personalize-header">
        <button onClick={() => navigateTo('arrange')} className="back-btn-glass">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="logo-tiny-personalize">petalink</div>
        <div style={{ width: '80px' }}></div>
      </header>

      <main className="personalize-main">
        {/* Title Area */}
        <div className="personalize-title-area">
          <h1 className="personalize-title">Personalize Your Gift</h1>
          <p className="personalize-subtitle">Write a letter and embed digital memories directly into the flowers.</p>
        </div>

        <div className="personalize-layout-grid">
          {/* Column 1: Interactive Bouquet Preview & Postcard */}
          <div className="layout-col-preview">
            <div className="mini-bouquet-container">
              <div className="mini-bouquet-canvas" onClick={handleCanvasClick}>
                <img src={classicBack} alt="" className="mini-wrap-layer back" />
                
                {activeGreenery.map(green => {
                  const randAngle = (getSeededRandom(reshuffleSeed, green.id + '-rot') * 16) - 8;
                  const randX = (getSeededRandom(reshuffleSeed, green.id + '-x') * 8) - 4;
                  const randY = (getSeededRandom(reshuffleSeed, green.id + '-y') * 8) - 4;
                  return (
                    <img
                      key={green.id}
                      src={getGreeneryAsset(green.type)}
                      alt=""
                      className="mini-greenery-asset"
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
                  const isEditing = activeLinkFlowerId === flower.uniqueId;
                  const hasLink = !!flower.link;

                  return (
                    <div
                      key={flower.uniqueId}
                      className={`mini-flower-wrapper ${isEditing ? 'editing' : ''}`}
                      onClick={() => {
                        setActiveLinkFlowerId(isEditing ? null : flower.uniqueId);
                      }}
                      style={{
                        left: `${slot.x + randX}%`,
                        top: `${slot.y + randY}%`,
                        zIndex: isEditing ? 50 : slot.zIndex,
                        transform: `translate(-50%, -50%) rotate(${randAngle}deg) scale(${scale})`
                      }}
                    >
                      <img src={flower.image} alt="" className="mini-flower-img" />
                      {hasLink && (
                        <div className="flower-link-badge">
                          <Link size={10} />
                        </div>
                      )}
                    </div>
                  );
                })}

                <img src={classicFront} alt="" className="mini-wrap-layer front" />
              </div>

              {/* Postcard overlay card placed in front of the wrap (zIndex 45) */}
              <div className="postcard-overlay-card">
                <input
                  type="text"
                  value={personalNote.to}
                  onChange={(e) => handleNoteChange('to', e.target.value)}
                  placeholder="recipient..."
                  className="postcard-input-to"
                />
                <input
                  type="text"
                  value={personalNote.from}
                  onChange={(e) => handleNoteChange('from', e.target.value)}
                  placeholder="sender..."
                  className="postcard-input-from"
                />
                <textarea
                  value={personalNote.message}
                  onChange={(e) => handleNoteChange('message', e.target.value)}
                  placeholder="Write your message here..."
                  className="postcard-textarea-message"
                />
              </div>

              {/* Floating popover card next to the active flower */}
              {activeLinkFlowerId && (() => {
                const activeFlowerIdx = selectedFlowers.findIndex(f => f.uniqueId === activeLinkFlowerId);
                if (activeFlowerIdx === -1) return null;
                const flower = selectedFlowers[activeFlowerIdx];
                const slot = flowerSlots[activeFlowerIdx] || flowerSlots[0];
                const randX = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-x') * 6) - 3;
                const randY = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-y') * 6) - 3;
                
                // Place popover slightly above the flower slot
                const popLeft = slot.x + randX;
                const popTop = Math.max(12, slot.y + randY - 14);

                return (
                  <div
                    className="flower-link-popover"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inputs
                    style={{
                      left: `${popLeft}%`,
                      top: `${popTop}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="popover-header">
                      <span className="popover-flower-name">{flower.name} #{activeFlowerIdx + 1}</span>
                    </div>
                    <div className="popover-body">
                      <input
                        type="url"
                        value={flower.link || ''}
                        onChange={(e) => updateFlowerLink(flower.uniqueId, e.target.value)}
                        placeholder="Paste YouTube, Spotify, Photo Link..."
                        className="popover-input"
                        autoFocus
                      />
                    </div>
                    <div className="popover-actions">
                      <button
                        onClick={() => setActiveLinkFlowerId(null)}
                        className="popover-save-btn"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Column 2: Side Information Card & Proceed Buttons */}
          <div className="layout-col-info-panel">
            <div className="personalize-info-card glass-card">
              <h2 className="info-card-title">How to Personalize</h2>
              
              <ul className="info-steps-list">
                <li className="info-step-item">
                  <span className="step-num">1</span>
                  <div className="step-content">
                    <strong>Write a Postcard:</strong> Type on the postcard's To, From, and Message lines. The recipient will see it typed in a vintage typewriter font.
                  </div>
                </li>
                <li className="info-step-item">
                  <span className="step-num">2</span>
                  <div className="step-content">
                    <strong>Embed Digital Links:</strong> Click directly on any flower in the bouquet to attach links (like YouTube videos, Spotify songs, or shared photo albums).
                  </div>
                </li>
                <li className="info-step-item">
                  <span className="step-num">3</span>
                  <div className="step-content">
                    <strong>Interactive Gift:</strong> When the recipient gets your bouquet, they can click on the flowers to open your embedded links directly!
                  </div>
                </li>
              </ul>
            </div>

            <button onClick={handleProceed} className="control-btn-proceed full-width">
              <span>Create Shareable Bouquet</span>
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
