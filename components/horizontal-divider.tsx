'use client';

import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

interface DividerContextType {
  positionY: number;
  setPositionY: (positionY: number) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  startPosY: number | null;
  setStartPosY: (startPosY: number | null) => void;
  parentHeight: number;
  parentTopOffset: number;
}

const DividerContext = createContext<DividerContextType | undefined>(undefined);

export function useHorizontalDivider() {
  const context = useContext(DividerContext);
  if (context === undefined) {
    throw new Error('useDivider must be used within a HorizontalDividerProvider');
  }
  return context;
}

interface HorizontalDividerProviderProps {
  initialY: number;
  parentHeight: number;
  parentTopOffset: number;
  children: ReactNode;
}

export const HorizontalDividerProvider: React.FC<HorizontalDividerProviderProps> = ({
  initialY, parentHeight, parentTopOffset, children,
}) => {
  const [positionY, setPositionY] = useState(initialY);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosY, setStartPosY] = useState<number | null>(null);

  const value = {
    positionY, setPositionY,
    isDragging, setIsDragging,
    startPosY, setStartPosY,
    parentHeight,
    parentTopOffset,
  };

  return <DividerContext.Provider value={value}>{children}</DividerContext.Provider>;
};

interface HorizontalDividerComponentProps {
  initialY?: number;
  children: ReactNode;
}

export const HorizontalDividerComponent: React.FC<HorizontalDividerComponentProps> = ({ initialY = 50, children }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(-1);
  const [parentHeight, setparentHeight] = useState<number>(0);
  const [parentTopOffset, setparentTopOffset] = useState<number>(0);

  useEffect(() => {
    const dividerParent = mainRef.current;
    if (!dividerParent) return;

    const updateLayout = () => {
      const newparentHeight = dividerParent.clientHeight;
      const newparentTopOffset = dividerParent.getBoundingClientRect().top;

      if (newparentHeight !== parentHeight) {
        setparentHeight(newparentHeight);
      }
      if (newparentTopOffset !== parentTopOffset) {
        setparentTopOffset(newparentTopOffset);
      }

      animationFrameId.current = requestAnimationFrame(updateLayout);
    };

    animationFrameId.current = requestAnimationFrame(updateLayout);
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [parentHeight, parentTopOffset]);

  return (
    <HorizontalDividerProvider
      initialY={initialY}
      parentHeight={parentHeight}
      parentTopOffset={parentTopOffset}
    >
      <div ref={mainRef} className="flex flex-col w-full h-full overflow-hidden">
        {children}
      </div>
    </HorizontalDividerProvider>
  );
};

export const TopSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { positionY } = useHorizontalDivider();
  return (
    <div className="overflow-hidden" style={{ flex: `${positionY} 1 0%` }}>
      {children}
    </div>
  );
};

export const BottomSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { positionY } = useHorizontalDivider();
  return (
    <div className="overflow-hidden" style={{ flex: `${100 - positionY} 1 0%` }}>
      {children}
    </div>
  );
};

export const HorizontalDivider: React.FC = () => {
  const { isDragging, setIsDragging, startPosY, setStartPosY, setPositionY, parentHeight,
    parentTopOffset, } = useHorizontalDivider();
  const animationFrameId = useRef<number>(-1);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosY(e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = requestAnimationFrame(() => {
        if (!isDragging || !startPosY) return;

        const deltaY = e.clientY - startPosY;
        const currentMousePosY = startPosY + deltaY - parentTopOffset;
        const posYPercentage = (currentMousePosY / parentHeight) * 100;
        const positionY = Math.max(0, Math.min(100, posYPercentage));

        setPositionY(positionY);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setStartPosY(null);
      cancelAnimationFrame(animationFrameId.current);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isDragging, startPosY, parentHeight, parentTopOffset]);

  return (
    <div
      className="z-10 relative cursor-ns-resize ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-200 touch-none select-none h-[4px] w-full my-[-1.5px] mx-0 bg-transparent hover:bg-[#ad9cff]"
      onMouseDown={handleMouseDown}
    />
  );
};
