import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import backgroundImg from '../../home page/background.png';
import { Sparkles, ExternalLink } from 'lucide-react';
import './Recipient.css';

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

export const Recipient: React.FC = () => {
  const {
    selectedFlowers,
    personalNote,
    reshuffleSeed
  } = useApp();

  const count = selectedFlowers.length;

  const handleFlowerClick = (link: string) => {
    if (!link) return;
    
    // Ensure the link has a protocol (http/https)
    let targetLink = link.trim();
    if (!/^https?:\/\//i.test(targetLink)) {
      targetLink = 'https://' + targetLink;
    }
    
    window.open(targetLink, '_blank', 'noopener,noreferrer');
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
    <div className="recipient-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      {/* Tiny branding line */}
      <div className="recipient-brand">petalink</div>

      <main className="recipient-main">
        <div className="recipient-interactive-area">
          <div className="recipient-bouquet-container">
            <div className="recipient-bouquet-canvas">
              <img src={classicBack} alt="" className="recipient-wrap-layer back" />
              
              {activeGreenery.map(green => {
                const randAngle = (getSeededRandom(reshuffleSeed, green.id + '-rot') * 16) - 8;
                const randX = (getSeededRandom(reshuffleSeed, green.id + '-x') * 8) - 4;
                const randY = (getSeededRandom(reshuffleSeed, green.id + '-y') * 8) - 4;
                return (
                  <img
                    key={green.id}
                    src={getGreeneryAsset(green.type)}
                    alt=""
                    className="recipient-greenery-asset"
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
                const hasLink = !!flower.link;

                return (
                  <div
                    key={flower.uniqueId}
                    className={`recipient-flower-wrapper ${hasLink ? 'interactive' : ''}`}
                    onClick={() => handleFlowerClick(flower.link)}
                    style={{
                      left: `${slot.x + randX}%`,
                      top: `${slot.y + randY}%`,
                      zIndex: slot.zIndex,
                      transform: `translate(-50%, -50%) rotate(${randAngle}deg) scale(${scale})`
                    }}
                    title={hasLink ? `Click to open link for this ${flower.name}` : undefined}
                  >
                    <img src={flower.image} alt="" className="recipient-flower-img" />
                    {hasLink && (
                      <div className="recipient-link-pulse">
                        <ExternalLink size={10} />
                      </div>
                    )}
                  </div>
                );
              })}

              <img src={classicFront} alt="" className="recipient-wrap-layer front" />
            </div>

            {/* Postcard overlay card placed in front of the wrap (zIndex 45) */}
            <div className="postcard-overlay-card-recipient">
              <div className="recipient-postcard-text-to">
                {personalNote.to || 'recipient'}
              </div>
              <div className="recipient-postcard-text-from">
                {personalNote.from || 'sender'}
              </div>
              <div className="recipient-postcard-text-message">
                {personalNote.message || 'Enjoy your beautiful bouquet!'}
              </div>
            </div>
          </div>

          {/* Interactive Cue */}
          <div className="recipient-hint-card glass-card">
            <Sparkles className="hint-icon" size={20} />
            <span>Click on the flowers with link markers to open their embedded contents!</span>
          </div>
        </div>
      </main>
    </div>
  );
};
