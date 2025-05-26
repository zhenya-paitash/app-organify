import { CSSProperties } from 'react';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

export interface CursorProps {
  // Основные настройки
  speed?: number;              // Скорость следования (default: 1)
  size?: number;              // Размер курсора (default: 20)
  color?: string;             // Цвет курсора
  blendMode?: BlendMode;      // Режим наложения
  stickRadius?: number;       // Радиус прилипания
  
  // Модификаторы
  enableStick?: boolean;      // Включить прилипание
  enableSquash?: boolean;     // Включить эффект сжатия
  enableRotation?: boolean;   // Включить вращение
  
  // Кастомизация
  className?: string;         // Дополнительные классы
  style?: CSSProperties;      // Дополнительные стили
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