import React from 'react';
import { useApp, SelectedFlower } from '../context/AppContext.tsx';
import backgroundImg from '../../home page/background.png';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import './Arrange.css';

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
  visualWeight: number; // Higher weight means more focal center placement
}

// Botanical scale and visual weight configuration for each species
// Scaled up smaller/medium flowers so they match the visual presence of peonies/sunflowers
const BOTANICAL_DATABASE: Record<string, BotanicalProps> = {
  rose: { baseScale: 1.1, visualWeight: 2 },
  lilies: { baseScale: 1.25, visualWeight: 3 },
  tulip: { baseScale: 1.0, visualWeight: 1 },
  sunflower: { baseScale: 1.35, visualWeight: 3 },
  peony: { baseScale: 1.3, visualWeight: 3 },
  daisy: { baseScale: 0.95, visualWeight: 1 },
  ranunculus: { baseScale: 1.05, visualWeight: 2 }
};

// Deterministic random generator based on a seed and a key
const getSeededRandom = (seed: number, key: string): number => {
  let hash = 0;
  const str = seed.toString() + key;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

export const Arrange: React.FC = () => {
  const {
    selectedFlowers,
    reshuffleSeed,
    reshuffle,
    navigateTo
  } = useApp();

  const count = selectedFlowers.length;

  // Sorting selected flowers by botanical visual weight (heavier flowers placed in focal center slots first)
  const sortedFlowers = [...selectedFlowers].sort((a, b) => {
    const weightA = BOTANICAL_DATABASE[a.id]?.visualWeight || 1;
    const weightB = BOTANICAL_DATABASE[b.id]?.visualWeight || 1;
    return weightB - weightA; // Descending weight
  });

  // Dynamic slot coordinates based on flower count to spread blooms evenly and avoid heavy blocking overlaps
  const getFlowerSlots = (flowerCount: number) => {
    switch (flowerCount) {
      case 4:
        return [
          { x: 50, y: 22, zIndex: 21 }, // Top center
          { x: 33, y: 32, zIndex: 22 }, // Mid left
          { x: 67, y: 32, zIndex: 23 }, // Mid right
          { x: 50, y: 41, zIndex: 24 }  // Bottom center
        ];
      case 5:
        return [
          { x: 50, y: 31, zIndex: 20 }, // Center
          { x: 34, y: 23, zIndex: 21 }, // Top left
          { x: 66, y: 23, zIndex: 22 }, // Top right
          { x: 36, y: 39, zIndex: 23 }, // Bottom left
          { x: 64, y: 39, zIndex: 24 }  // Bottom right
        ];
      case 6:
        return [
          { x: 44, y: 24, zIndex: 20 }, // Mid-left top
          { x: 56, y: 24, zIndex: 21 }, // Mid-right top
          { x: 32, y: 33, zIndex: 22 }, // Far left
          { x: 68, y: 33, zIndex: 23 }, // Far right
          { x: 42, y: 42, zIndex: 24 }, // Mid-left bottom
          { x: 58, y: 42, zIndex: 25 }  // Mid-right bottom
        ];
      case 7:
        return [
          { x: 50, y: 31, zIndex: 23 }, // Center
          { x: 50, y: 19, zIndex: 20 }, // Top center
          { x: 33, y: 23, zIndex: 21 }, // Top left
          { x: 67, y: 23, zIndex: 22 }, // Top right
          { x: 50, y: 42, zIndex: 26 }, // Bottom center
          { x: 35, y: 38, zIndex: 24 }, // Bottom left
          { x: 65, y: 38, zIndex: 25 }  // Bottom right
        ];
      case 8:
      default:
        return [
          { x: 50, y: 31, zIndex: 23 }, // Center
          { x: 35, y: 29, zIndex: 21 }, // Left shoulder
          { x: 65, y: 29, zIndex: 22 }, // Right shoulder
          { x: 50, y: 19, zIndex: 20 }, // Top peak
          { x: 30, y: 21, zIndex: 19 }, // Far top-left
          { x: 70, y: 21, zIndex: 18 }, // Far top-right
          { x: 38, y: 42, zIndex: 24 }, // Bottom left support
          { x: 62, y: 42, zIndex: 25 }  // Bottom right support
        ];
    }
  };

  const flowerSlots = getFlowerSlots(count);

  // Dynamic Greenery Visibility based on flower count:
  // - 4 flowers: render 9 greenery items (high volume to fill space)
  // - 5-6 flowers: render 5 greenery items (medium volume)
  // - 7-8 flowers: render 3 greenery items (low volume to prevent crowding)
  // Coordinates are pulled inward horizontally so they frame the bouquet without sticking out of the paper bounds
  const getGreeneryElements = (flowerCount: number) => {
    const allGreenery = [
      // Base framing (rendered for all bouquets)
      { id: 'large-euc-l', type: 'large-euc', x: 32, y: 24, rotation: -20, zIndex: 11, scale: 0.9 },
      { id: 'large-euc-r', type: 'large-euc', x: 68, y: 24, rotation: 20, zIndex: 10, scale: 0.9 },
      { id: 'baby-breath-c', type: 'baby-breath', x: 50, y: 15, rotation: 0, zIndex: 12, scale: 0.8 },
      
      // Supporting greenery (rendered for 6 or fewer flowers)
      { id: 'med-euc-l', type: 'med-euc', x: 26, y: 34, rotation: -35, zIndex: 9, scale: 0.9 },
      { id: 'med-euc-r', type: 'med-euc', x: 74, y: 34, rotation: 35, zIndex: 8, scale: 0.9 },
      
      // High-volume accent fillers (rendered only for 4 flowers)
      { id: 'baby-breath-l', type: 'baby-breath', x: 36, y: 17, rotation: -10, zIndex: 13, scale: 0.85 },
      { id: 'baby-breath-r', type: 'baby-breath', x: 64, y: 17, rotation: 10, zIndex: 14, scale: 0.85 },
      { id: 'wax-l', type: 'wax', x: 31, y: 39, rotation: -12, zIndex: 15, scale: 0.95 },
      { id: 'wax-r', type: 'wax', x: 69, y: 39, rotation: 12, zIndex: 16, scale: 0.95 }
    ];

    if (flowerCount === 4) {
      return allGreenery;
    } else if (flowerCount <= 6) {
      return allGreenery.slice(0, 7); // Render 7 items for medium bouquets
    } else {
      return allGreenery.slice(0, 5); // Render 5 items for large bouquets (adds Eucalyptus shoulders)
    }
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

  const activeGreenery = getGreeneryElements(count);

  return (
    <div className="arrange-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      {/* Header Bar */}
      <header className="arrange-header">
        <button onClick={() => navigateTo('select')} className="back-btn-glass">
          <ArrowLeft size={18} />
          <span>Edit Flowers</span>
        </button>
        <div className="logo-tiny-arrange">petalink</div>
        <div style={{ width: '100px' }}></div>
      </header>

      <main className="arrange-main">
        {/* Title Area */}
        <div className="arrange-title-area">
          <h1 className="arrange-title">Arrange Bouquet</h1>
          <p className="arrange-subtitle">Reshuffle to tie the flowers uniquely and adjust positions.</p>
        </div>

        {/* 3D-Layered Bouquet Preview Canvas */}
        <div className="bouquet-canvas-container">
          <div className="bouquet-canvas">
            
            {/* 1. Classic Back Wrap Paper */}
            <img src={classicBack} alt="" className="wrap-layer back-wrap" />

            {/* 2. Layered Greenery (Eucalyptus and fillers framing the perimeter) */}
            {activeGreenery.map(green => {
              const randAngle = (getSeededRandom(reshuffleSeed, green.id + '-rot') * 16) - 8;
              const randX = (getSeededRandom(reshuffleSeed, green.id + '-x') * 8) - 4;
              const randY = (getSeededRandom(reshuffleSeed, green.id + '-y') * 8) - 4;
              const asset = getGreeneryAsset(green.type);

              return (
                <img
                  key={green.id}
                  src={asset}
                  alt=""
                  className="greenery-asset"
                  style={{
                    left: `${green.x + randX}%`,
                    top: `${green.y + randY}%`,
                    transform: `translate(-50%, -50%) rotate(${green.rotation + randAngle}deg) scale(${green.scale})`,
                    zIndex: green.zIndex
                  }}
                />
              );
            })}

            {/* 3. Sorted Selected Flowers (Positioned with botanical scaling and overlaps) */}
            {sortedFlowers.map((flower, index) => {
              const slot = flowerSlots[index] || flowerSlots[0];
              const botanical = BOTANICAL_DATABASE[flower.id] || { baseScale: 1.0, visualWeight: 2 };

              // Seeded random jitter offsets per reshuffle seed
              const randAngle = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-rot') * 30) - 15; // ±15deg tilt
              const randX = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-x') * 6) - 3;      // ±3% horizontal offset
              const randY = (getSeededRandom(reshuffleSeed, flower.uniqueId + '-y') * 6) - 3;      // ±3% vertical offset
              const randScale = 0.95 + (getSeededRandom(reshuffleSeed, flower.uniqueId + '-scale') * 0.1); // ±5% scale jitter

              const finalScale = botanical.baseScale * randScale;

              return (
                <div
                  key={flower.uniqueId}
                  className="flower-asset-wrapper"
                  style={{
                    left: `${slot.x + randX}%`,
                    top: `${slot.y + randY}%`,
                    zIndex: slot.zIndex,
                    transform: `translate(-50%, -50%) rotate(${randAngle}deg) scale(${finalScale})`
                  }}
                >
                  <img src={flower.image} alt={flower.name} className="flower-asset-img" />
                </div>
              );
            })}

            {/* 4. Classic Front Wrap Paper (Ribbon and front overlap) */}
            <img src={classicFront} alt="" className="wrap-layer front-wrap" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="arrange-controls">
          <button onClick={reshuffle} className="control-btn-glass reshuffle-btn">
            <RefreshCw size={18} />
            <span>Rearrange</span>
          </button>

          <button onClick={() => navigateTo('personalize')} className="control-btn-proceed">
            <span>Add Personal Note</span>
            <Sparkles size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};
