import React, { useState, useEffect } from 'react';
import { useApp, FlowerType } from '../context/AppContext.tsx';
import backgroundImg from '../../home page/background.png';
import { ArrowLeft, Sparkles, Minus, Trash2 } from 'lucide-react';
import './Select.css';

export const Select: React.FC = () => {
  const {
    availableFlowers,
    selectedFlowers,
    addFlower,
    removeFlower,
    clearSelection,
    navigateTo
  } = useApp();

  const count = selectedFlowers.length;
  const isValid = count >= 4 && count <= 8;
  const [showPetals, setShowPetals] = useState(false);

  // Trigger falling pink petals celebration when bouquet hits max capacity (8 flowers)
  useEffect(() => {
    if (count === 8) {
      setShowPetals(true);
      const timer = setTimeout(() => {
        setShowPetals(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [count]);

  // Helper to count instances of a flower type
  const getFlowerCount = (id: string): number => {
    return selectedFlowers.filter(f => f.id === id).length;
  };

  // Add flower handler
  const handleAdd = (flower: FlowerType) => {
    if (count < 8) {
      addFlower(flower);
    }
  };

  // Remove flower handler (removes the last added flower of this type)
  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents triggering the parent add click
    const list = [...selectedFlowers].reverse();
    const found = list.find(f => f.id === id);
    if (found) {
      removeFlower(found.uniqueId);
    }
  };

  return (
    <div className="select-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      {/* Falling Petals Animation Layer */}
      {showPetals && (
        <div className="petals-container">
          {Array.from({ length: 30 }).map((_, idx) => {
            const delay = idx * 0.12;
            const left = Math.random() * 100;
            const rotate = Math.random() * 360;
            const scale = 0.5 + Math.random() * 0.5;
            const duration = 3.5 + Math.random() * 1.5;
            return (
              <div
                key={idx}
                className="petal"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `rotate(${rotate}deg) scale(${scale})`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Header Bar */}
      <header className="select-header">
        <button onClick={() => navigateTo('home')} className="back-btn">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="logo-tiny">petalink</div>
        {count > 0 ? (
          <button onClick={clearSelection} className="clear-btn-header">
            Clear
          </button>
        ) : (
          <div style={{ width: '70px' }}></div> /* Spacer */
        )}
      </header>

      <main className="select-main-simple">
        {/* Title area */}
        <div className="inventory-title-area-simple">
          <h1 className="inventory-title-simple">Select Flowers</h1>
          <p className="inventory-subtitle-simple">Tap to add. Select between 4 and 8 flowers.</p>
        </div>

        {/* Circular Flower Buttons Grid */}
        <div className="flower-circle-grid">
          {availableFlowers.map(flower => {
            const qty = getFlowerCount(flower.id);
            const hasQty = qty > 0;
            return (
              <div key={flower.id} className="flower-circle-item">
                {/* Flower Name above the circle */}
                <span className="flower-circle-name">{flower.name}</span>

                {/* Circular Button */}
                {/* Circular Button Wrapper (div instead of button to prevent nested button console warning) */}
                <div
                  onClick={() => !(count >= 8 && qty === 0) && handleAdd(flower)}
                  className={`flower-circle-btn ${hasQty ? 'selected' : ''} ${count >= 8 && qty === 0 ? 'disabled' : ''}`}
                  style={{
                    borderColor: hasQty ? flower.color : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: hasQty ? `0 8px 25px rgba(${hexToRgb(flower.color)}, 0.25)` : 'var(--shadow-sm)',
                    cursor: count >= 8 && qty === 0 ? 'not-allowed' : 'pointer'
                  }}
                  title={`Add ${flower.name}`}
                >
                  <img src={flower.image} alt={flower.name} className="flower-circle-img" />

                  {/* Notification Badge (Top-Right) */}
                  {qty > 0 && (
                    <span className="qty-badge" style={{ backgroundColor: flower.color }}>
                      {qty}
                    </span>
                  )}

                  {/* Minus Control (Bottom-Left) */}
                  {qty > 0 && (
                    <button
                      onClick={(e) => handleRemove(e, flower.id)}
                      className="circle-minus-btn"
                      title={`Remove one ${flower.name}`}
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Basket Bar */}
      <div className={`floating-basket-bar ${count > 0 ? 'visible' : ''}`}>
        <div className="floating-basket-inner glass-card">
          {/* Thumbnails Row */}
          <div className="basket-thumbnails-col">
            <span className="basket-count-pill">{count}/8</span>
            <div className="basket-mini-pile">
              {selectedFlowers.map((flower, idx) => (
                <div
                  key={flower.uniqueId}
                  className="basket-mini-thumbnail"
                  style={{
                    zIndex: idx + 1,
                    marginLeft: idx > 0 ? '-14px' : '0'
                  }}
                >
                  <img src={flower.image} alt="" className="mini-thumb-img" />
                </div>
              ))}
            </div>
          </div>

          {/* Validation note & CTA button */}
          <div className="basket-actions-col">
            {count < 4 ? (
              <span className="basket-help-text">Add {4 - count} more</span>
            ) : (
              <button onClick={clearSelection} className="basket-clear-icon-btn" title="Clear all">
                <Trash2 size={16} />
              </button>
            )}

            <button
              onClick={() => isValid && navigateTo('arrange')}
              disabled={!isValid}
              className={`basket-proceed-btn ${isValid ? 'active' : ''}`}
            >
              <span>Arrange</span>
              <Sparkles size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper utility to convert Hex to RGB values for custom drop shadows
function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
