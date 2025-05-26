export const CURSOR_SIZE = 10;

export const DEFAULT_CURSOR_CONFIG = {
  speed: 1,
  size: CURSOR_SIZE,
  stickRadius: 50,
  enableStick: true,
  enableSquash: true,
  enableRotation: true,
  blendMode: 'normal' as const,
} as const;

export const CURSOR_ATTRIBUTES = {
  STICK: 'data-cursor-stick',
  COLOR: 'data-cursor-color',
  SIZE: 'data-cursor-size',
  BLEND: 'data-cursor-blend',
  TEXT: 'data-cursor-text',
  SCALE: 'data-cursor-scale',
} as const;

export const CURSOR_CLASSES = {
  ROOT: 'cursor',
  STICKING: 'cursor--sticking',
  SQUASHED: 'cursor--squashed',
  ROTATING: 'cursor--rotating',
} as const; 