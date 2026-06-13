import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FlowerType {
  id: string;
  name: string;
  image: string;
  color: string;
}

export interface SelectedFlower {
  uniqueId: string; // Unique instance ID
  id: string;       // Flower type ID
  name: string;
  image: string;
  link: string;
}

export interface PersonalNote {
  from: string;
  to: string;
  message: string;
}

export type WrapStyle = 'korean' | 'classic' | 'ribbon';

export type PageId = 'home' | 'select' | 'arrange' | 'personalize' | 'share' | 'recipient';

interface AppContextType {
  currentPage: PageId;
  navigateTo: (page: PageId) => void;
  availableFlowers: FlowerType[];
  selectedFlowers: SelectedFlower[];
  addFlower: (flower: FlowerType) => boolean;
  removeFlower: (uniqueId: string) => void;
  clearSelection: () => void;
  wrapStyle: WrapStyle;
  setWrapStyle: (wrap: WrapStyle) => void;
  personalNote: PersonalNote;
  setPersonalNote: (note: PersonalNote) => void;
  updateFlowerLink: (uniqueId: string, link: string) => void;
  reshuffleSeed: number;
  reshuffle: () => void;
  shareCode: string | null;
  generateShareCode: () => string;
  loadShareData: (code: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Available flowers matching the static assets uploaded
import roseImg from '../../flowers/rose.png';
import liliesImg from '../../flowers/lilies.png';
import tulipImg from '../../flowers/pink tulip.png';
import sunflowerImg from '../../flowers/sunflower.png';
import peonyImg from '../../flowers/peony.png';
import daisyImg from '../../flowers/daisy.png';
import ranunculusImg from '../../flowers/ranunculus.png';

const AVAILABLE_FLOWERS: FlowerType[] = [
  { id: 'rose', name: 'Red Rose', image: roseImg, color: '#e0474c' },
  { id: 'lilies', name: 'White Lily', image: liliesImg, color: '#f3ece3' },
  { id: 'tulip', name: 'Pink Tulip', image: tulipImg, color: '#f5a2b0' },
  { id: 'sunflower', name: 'Sunflower', image: sunflowerImg, color: '#f0c243' },
  { id: 'peony', name: 'Peony', image: peonyImg, color: '#e58ea3' },
  { id: 'daisy', name: 'Daisy', image: daisyImg, color: '#eae1cc' },
  { id: 'ranunculus', name: 'Ranunculus', image: ranunculusImg, color: '#e67484' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedFlowers, setSelectedFlowers] = useState<SelectedFlower[]>([]);
  const [wrapStyle, setWrapStyle] = useState<WrapStyle>('classic');
  const [personalNote, setPersonalNote] = useState<PersonalNote>({
    from: '',
    to: '',
    message: ''
  });
  const [reshuffleSeed, setReshuffleSeed] = useState<number>(0.5);
  const [shareCode, setShareCode] = useState<string | null>(null);

  // Read URL parameters for recipient experience
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bCode = params.get('b');
    if (bCode) {
      const loaded = loadShareData(bCode);
      if (loaded) {
        setCurrentPage('recipient');
      }
    }
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addFlower = (flower: FlowerType): boolean => {
    if (selectedFlowers.length >= 8) return false;
    const newFlower: SelectedFlower = {
      uniqueId: `${flower.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      id: flower.id,
      name: flower.name,
      image: flower.image,
      link: ''
    };
    setSelectedFlowers([...selectedFlowers, newFlower]);
    return true;
  };

  const removeFlower = (uniqueId: string) => {
    setSelectedFlowers(selectedFlowers.filter(f => f.uniqueId !== uniqueId));
  };

  const clearSelection = () => {
    setSelectedFlowers([]);
  };

  const updateFlowerLink = (uniqueId: string, link: string) => {
    setSelectedFlowers(
      selectedFlowers.map(f => (f.uniqueId === uniqueId ? { ...f, link } : f))
    );
  };

  const reshuffle = () => {
    setReshuffleSeed(Math.random());
  };

  const generateShareCode = (): string => {
    // Basic base64 compression of state to allow client-side URL sharing
    const data = {
      flowers: selectedFlowers.map(f => ({ id: f.id, link: f.link })),
      wrap: wrapStyle,
      note: personalNote
    };
    const jsonStr = JSON.stringify(data);
    const code = btoa(encodeURIComponent(jsonStr));
    setShareCode(code);
    return code;
  };

  const loadShareData = (code: string): boolean => {
    try {
      const decodedStr = decodeURIComponent(atob(code));
      const data = JSON.parse(decodedStr);
      
      const mappedFlowers = data.flowers.map((f: { id: string; link: string }, index: number) => {
        const type = AVAILABLE_FLOWERS.find(t => t.id === f.id);
        return {
          uniqueId: `${f.id}-${index}-${Date.now()}`,
          id: f.id,
          name: type ? type.name : f.id,
          image: type ? type.image : '',
          link: f.link || ''
        };
      });

      setSelectedFlowers(mappedFlowers);
      setWrapStyle(data.wrap || 'classic');
      setPersonalNote(data.note || { from: '', to: '', message: '' });
      setShareCode(code);
      return true;
    } catch (e) {
      console.error('Failed to load shared bouquet', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        availableFlowers: AVAILABLE_FLOWERS,
        selectedFlowers,
        addFlower,
        removeFlower,
        clearSelection,
        wrapStyle,
        setWrapStyle,
        personalNote,
        setPersonalNote,
        updateFlowerLink,
        reshuffleSeed,
        reshuffle,
        shareCode,
        generateShareCode,
        loadShareData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
