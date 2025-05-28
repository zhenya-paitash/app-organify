import { CSSProperties } from 'react';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

export interface CursorProps {
  speed?: number;
  size?: number;
  color?: string;
  blendMode?: BlendMode;
  stickRadius?: number;

  enableStick?: boolean;
  enableSquash?: boolean;
  enableRotation?: boolean;

  className?: string;
  style?: CSSProperties;
}

export interface CursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  isSticking: boolean;
  customScale?: number;
  customColor?: string;
  customBlend?: BlendMode;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export interface CursorVelocity {
  x: number;
  y: number;
} 
