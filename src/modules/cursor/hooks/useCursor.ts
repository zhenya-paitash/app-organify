'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnimationFrame } from './useAnimationFrame';
import { CursorProps, CursorState, CursorPosition, CursorVelocity, BlendMode } from '../types';
import { DEFAULT_CURSOR_CONFIG, CURSOR_ATTRIBUTES, CURSOR_SIZE } from '../constants';

// Функция для поиска ближайшего родителя с атрибутом
const findClosestStickElement = (element: HTMLElement | null): HTMLElement | null => {
  if (!element) return null;
  if (element.hasAttribute(CURSOR_ATTRIBUTES.STICK)) return element;
  return findClosestStickElement(element.parentElement);
};

export const useCursor = (props: CursorProps) => {
  const pathname = usePathname();
  const [state, setState] = useState<CursorState>({
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    isSticking: false,
    isHidden: false,
  });

  const velocity = useRef<CursorVelocity>({ x: 0, y: 0 });
  const config = { ...DEFAULT_CURSOR_CONFIG, ...props };
  const currentElement = useRef<HTMLElement | null>(null);
  const currentSize = useRef<number>(props.size || CURSOR_SIZE);
  const mousePosition = useRef<CursorPosition>({ x: -100, y: -100 });

  // Сброс состояния при навигации или закрытии модального окна
  const resetState = useCallback(() => {
    currentElement.current = null;
    currentSize.current = props.size || CURSOR_SIZE;
    setState(prev => ({
      ...prev,
      isSticking: false,
      isHidden: false,
      customScale: undefined,
      customColor: undefined,
      customSize: undefined,
      customBlend: undefined,
    }));
  }, [props.size]);

  useEffect(() => {
    resetState();
  }, [pathname, resetState]);

  // Слушаем изменения в DOM для обработки закрытия модальных окон
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
          // Проверяем, был ли удален текущий элемент
          if (currentElement.current && !document.contains(currentElement.current)) {
            resetState();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [resetState]);

  // Обработчик движения мыши
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
    
    if (!state.isSticking) {
      setState(prev => ({
        ...prev,
        targetX: e.clientX - currentSize.current / 2,
        targetY: e.clientY - currentSize.current / 2,
      }));
    } else if (currentElement.current) {
      const rect = currentElement.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Вычисляем смещение от центра элемента к курсору
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      // Ограничиваем смещение в зависимости от размера элемента
      const maxOffset = Math.min(rect.width, rect.height) * 0.05; // 5% от размера элемента
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const offsetX = Math.min(distance, maxOffset) * Math.cos(angle);
      const offsetY = Math.min(distance, maxOffset) * Math.sin(angle);
      
      setState(prev => ({
        ...prev,
        targetX: centerX + offsetX - currentSize.current / 2,
        targetY: centerY + offsetY - currentSize.current / 2,
      }));
    }
  }, [state.isSticking]);

  // Обработчик наведения на элементы
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Проверяем атрибуты на самом элементе
    const customSize = target.getAttribute('data-cursor-size');
    const customColor = target.getAttribute('data-cursor-color');
    const customBlend = target.getAttribute('data-cursor-blend') as BlendMode;
    const customScale = target.getAttribute('data-cursor-scale');
    const shouldHide = target.hasAttribute('data-cursor-hide');
    const shouldStick = target.hasAttribute('data-cursor-stick');
    
    // Если на элементе нет атрибутов, ищем ближайшего родителя с атрибутами
    if (!customSize && !customColor && !customBlend && !customScale && !shouldHide && !shouldStick) {
      let parent = target.parentElement;
      while (parent) {
        const parentCustomSize = parent.getAttribute('data-cursor-size');
        const parentCustomColor = parent.getAttribute('data-cursor-color');
        const parentCustomBlend = parent.getAttribute('data-cursor-blend') as BlendMode;
        const parentCustomScale = parent.getAttribute('data-cursor-scale');
        const parentShouldHide = parent.hasAttribute('data-cursor-hide');
        const parentShouldStick = parent.hasAttribute('data-cursor-stick');
        
        if (parentCustomSize || parentCustomColor || parentCustomBlend || parentCustomScale || parentShouldHide || parentShouldStick) {
          if (parentCustomSize) currentSize.current = parseInt(parentCustomSize);
          if (parentShouldStick) currentElement.current = parent;
          
          setState(prev => ({
            ...prev,
            isSticking: parentShouldStick,
            isHidden: parentShouldHide,
            customSize: parentCustomSize ? parseInt(parentCustomSize) : undefined,
            customColor: parentCustomColor || undefined,
            customBlend: parentCustomBlend || undefined,
            customScale: parentCustomScale ? parseFloat(parentCustomScale) : undefined,
          }));
          return;
        }
        parent = parent.parentElement;
      }
    }
    
    // Если на элементе есть атрибуты, применяем их
    if (customSize) {
      currentSize.current = parseInt(customSize);
    }
    
    if (shouldStick) {
      currentElement.current = target;
    }
    
    setState(prev => ({
      ...prev,
      isSticking: shouldStick,
      isHidden: shouldHide,
      customSize: customSize ? parseInt(customSize) : undefined,
      customColor: customColor || undefined,
      customBlend: customBlend || undefined,
      customScale: customScale ? parseFloat(customScale) : undefined,
    }));
  }, []);

  // Обработчик ухода с элементов
  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    // Проверяем, не перешли ли мы на дочерний элемент
    if (relatedTarget && target.contains(relatedTarget)) {
      return;
    }
    
    // Проверяем, не перешли ли мы на родительский элемент
    if (relatedTarget && relatedTarget.contains(target)) {
      return;
    }
    
    // Сбрасываем состояние только если ушли с элемента, имеющего атрибуты
    if (target.hasAttribute('data-cursor-stick') || 
        target.hasAttribute('data-cursor-scale') || 
        target.hasAttribute('data-cursor-color') || 
        target.hasAttribute('data-cursor-blend') || 
        target.hasAttribute('data-cursor-size') || 
        target.hasAttribute('data-cursor-hide')) {
      
      currentElement.current = null;
      currentSize.current = props.size || CURSOR_SIZE;
      setState(prev => ({
        ...prev,
        isSticking: false,
        isHidden: false,
        customScale: undefined,
        customColor: undefined,
        customSize: undefined,
        customBlend: undefined,
      }));
    }
  }, [props.size]);

  // Анимация
  useAnimationFrame(() => {
    setState(prev => {
      const dx = prev.targetX - prev.x;
      const dy = prev.targetY - prev.y;
      
      // Обновляем скорость
      velocity.current = {
        x: dx * config.speed * 0.2,
        y: dy * config.speed * 0.2,
      };

      // Вычисляем новую позицию
      const newX = prev.x + velocity.current.x;
      const newY = prev.y + velocity.current.y;

      // Вычисляем угол и сжатие как в оригинальной реализации
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const squeeze = Math.min(distance / 200, 0.2);

      // Вычисляем масштаб по X и Y для асимметричного сплющивания
      const baseScale = prev.customScale || 1;
      const scaleX = baseScale * (1 + squeeze);
      const scaleY = baseScale * (1 - squeeze);

      return {
        ...prev,
        x: newX,
        y: newY,
        scaleX,
        scaleY,
        rotation: config.enableRotation ? angle : 0,
      };
    });
  });

  // Добавляем обработчики событий
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseOut]);

  return state;
}; 