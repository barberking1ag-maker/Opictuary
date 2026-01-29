import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { hapticImpact } from '@/lib/mobileUtils';

interface SwipeAction {
  icon: React.ReactNode;
  label: string;
  color: string;
  onAction: () => void;
}

interface SwipeableItemProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
  className?: string;
}

export function SwipeableItem({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 80,
  className,
}: SwipeableItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = startXRef.current;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    
    const hasLeftActions = leftActions.length > 0;
    const hasRightActions = rightActions.length > 0;
    
    if (diff > 0 && !hasLeftActions) return;
    if (diff < 0 && !hasRightActions) return;
    
    const maxSwipe = threshold * 1.5;
    const boundedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    setTranslateX(boundedDiff);
    
    if (Math.abs(boundedDiff) >= threshold) {
      hapticImpact('light');
    }
  }, [isDragging, leftActions.length, rightActions.length, threshold]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    
    if (Math.abs(translateX) >= threshold) {
      if (translateX > 0 && leftActions.length > 0) {
        leftActions[0].onAction();
        hapticImpact('medium');
      } else if (translateX < 0 && rightActions.length > 0) {
        rightActions[0].onAction();
        hapticImpact('medium');
      }
    }
    
    setTranslateX(0);
  }, [translateX, threshold, leftActions, rightActions]);

  const leftActionsWidth = leftActions.length * 70;
  const rightActionsWidth = rightActions.length * 70;

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
    >
      {leftActions.length > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 flex items-center"
          style={{ width: leftActionsWidth }}
        >
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onAction}
              className={cn(
                'flex flex-col items-center justify-center h-full px-4',
                action.color
              )}
              style={{ width: 70 }}
              data-testid={`swipe-action-left-${index}`}
            >
              {action.icon}
              <span className="text-xs mt-1 text-white">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {rightActions.length > 0 && (
        <div 
          className="absolute right-0 top-0 bottom-0 flex items-center"
          style={{ width: rightActionsWidth }}
        >
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onAction}
              className={cn(
                'flex flex-col items-center justify-center h-full px-4',
                action.color
              )}
              style={{ width: 70 }}
              data-testid={`swipe-action-right-${index}`}
            >
              {action.icon}
              <span className="text-xs mt-1 text-white">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          'relative bg-background z-10',
          isDragging ? '' : 'transition-transform duration-200'
        )}
        style={{ 
          transform: `translateX(${translateX}px)`,
          touchAction: 'pan-y'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
