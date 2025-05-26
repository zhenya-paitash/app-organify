'use client';

import { useRef } from 'react';
import { useCursor } from './hooks/useCursor';
import { CursorProps } from './types';
import { CURSOR_SIZE } from './constants';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export const Cursor: React.FC<CursorProps> = (props) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const state = useCursor(props);

  return (
    <div
      ref={cursorRef}
      className={cn(
        styles.cursor,
        state.isSticking && styles.sticking,
        (state.scaleX !== 1 || state.scaleY !== 1) && styles.squashed,
        state.rotation !== 0 && styles.rotating,
        state.isHidden && styles.hidden,
        props.className
      )}
      style={{
        '--cursor-x': `${state.x}px`,
        '--cursor-y': `${state.y}px`,
        '--cursor-scale-x': state.scaleX,
        '--cursor-scale-y': state.scaleY,
        '--cursor-rotation': `${state.rotation}deg`,
        '--cursor-size': `${state.customSize || props.size || CURSOR_SIZE}px`,
        '--cursor-blend-mode': state.customBlend || props.blendMode,
        '--cursor-color': state.customColor,
        transform: `translate3d(var(--cursor-x), var(--cursor-y), 0) rotate(var(--cursor-rotation)) scale(var(--cursor-scale-x), var(--cursor-scale-y))`,
        ...props.style,
      } as React.CSSProperties}
    />
  );
}; 