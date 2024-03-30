'use client';

import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

interface DividerContextType {
  positionX: number;
  setPositionX: (positionX: number) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  startPosX: number | null;
  setStartPosX: (startPosX: number | null) => void;
  parentWidth: number;
  parentLeftOffset: number;
}

const DividerContext = createContext<DividerContextType | undefined>(undefined);

export function useVerticalDivider() {
  const context = useContext(DividerContext);
  if (context === undefined) {
    throw new Error('useDivider must be used within a VerticalDividerProvider');
  }
  return context;
}

interface VerticalDividerProviderProps {
  initialX: number;
  parentWidth: number;
  parentLeftOffset: number;
  children: ReactNode;
}

export const VerticalDividerProvider: React.FC<VerticalDividerProviderProps> = ({
  initialX, parentWidth, parentLeftOffset, children,
}) => {
  const [positionX, setPositionX] = useState(initialX);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosX, setStartPosX] = useState<number | null>(null);

  const value = {
    positionX, setPositionX,
    isDragging, setIsDragging,
    startPosX, setStartPosX,
    parentWidth,
    parentLeftOffset,
  };

  return <DividerContext.Provider value={value}>{children}</DividerContext.Provider>;
};

interface VerticalDividerComponentProps {
  initialX?: number;
  children: ReactNode;
}

export const VerticalDividerComponent: React.FC<VerticalDividerComponentProps> = ({ initialX = 50, children }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(-1);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [parentLeftOffset, setParentLeftOffset] = useState<number>(0);

  useEffect(() => {
    const dividerParent = mainRef.current;
    if (!dividerParent) return;

    const updateLayout = () => {
      const newParentWidth = dividerParent.clientWidth;
      const newParentLeftOffset = dividerParent.getBoundingClientRect().left;

      if (newParentWidth !== parentWidth) {
        setParentWidth(newParentWidth);
      }
      if (newParentLeftOffset !== parentLeftOffset) {
        setParentLeftOffset(newParentLeftOffset);
      }

      animationFrameId.current = requestAnimationFrame(updateLayout);
    };

    animationFrameId.current = requestAnimationFrame(updateLayout);
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [parentWidth, parentLeftOffset]);

  return (
    <VerticalDividerProvider
      initialX={initialX}
      parentWidth={parentWidth}
      parentLeftOffset={parentLeftOffset}
    >
      <div ref={mainRef} className="flex flex-row w-full h-full overflow-hidden">
        {children}
      </div>
    </VerticalDividerProvider>
  );
};

export const LeftSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { positionX } = useVerticalDivider();
  return (
    <div className="overflow-hidden" style={{ flex: `${positionX} 1 0%` }}>
      {children}
    </div>
  );
};

export const RightSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { positionX } = useVerticalDivider();
  return (
    <div className="overflow-hidden" style={{ flex: `${100 - positionX} 1 0%` }}>
      {children}
    </div>
  );
};

export const VerticalDivider: React.FC = () => {
  const { isDragging, setIsDragging, startPosX, setStartPosX, setPositionX, parentWidth,
    parentLeftOffset, } = useVerticalDivider();
  const animationFrameId = useRef<number>(-1);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosX(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = requestAnimationFrame(() => {
        if (!isDragging || !startPosX) return;

        const deltaX = e.clientX - startPosX;
        const currentMousePosX = startPosX + deltaX - parentLeftOffset;
        const posXPercentage = (currentMousePosX / parentWidth) * 100;
        const positionX = Math.max(0, Math.min(100, posXPercentage));

        setPositionX(positionX);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setStartPosX(null);
      cancelAnimationFrame(animationFrameId.current);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isDragging, startPosX, parentWidth, parentLeftOffset]);

  return (
    <div
      className="z-10 relative cursor-ew-resize ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-200 touch-none select-none h-full w-[4px] my-0 mx-[-1.5px] bg-transparent hover:bg-[#ad9cff]"
      onMouseDown={handleMouseDown}
    />
  );
};
