'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: ContextMenuItem[];
}

export function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Position menu within viewport bounds
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const menuRect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      // Adjust horizontal position if menu would overflow right edge
      if (x + menuRect.width > viewportWidth) {
        adjustedX = viewportWidth - menuRect.width - 8;
      }

      // Adjust vertical position if menu would overflow bottom edge
      if (y + menuRect.height > viewportHeight) {
        adjustedY = viewportHeight - menuRect.height - 8;
      }

      // Ensure menu doesn't go beyond left or top edges
      adjustedX = Math.max(8, adjustedX);
      adjustedY = Math.max(8, adjustedY);

      menu.style.left = `${adjustedX}px`;
      menu.style.top = `${adjustedY}px`;
    }
  }, [x, y]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add a small delay to prevent immediate closing from the right-click event
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Prevent scrolling while menu is open
  useEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  const contextMenu = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={menuRef}
        className="fixed py-1 min-w-[160px] rounded-md border shadow-lg"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-foreground)',
          pointerEvents: 'auto',
          fontSize: '14px',
          animation: 'context-menu-in 0.15s ease-out'
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={cn(
              'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all duration-75',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              item.danger
                ? 'text-red-600 hover:bg-red-600 hover:bg-opacity-10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                : 'hover:bg-accent hover:bg-opacity-50'
            )}
            style={{
              color: item.danger
                ? undefined
                : 'var(--color-foreground)'
            }}
          >
            {item.icon && (
              <span className="w-4 h-4 flex-shrink-0">
                {item.icon}
              </span>
            )}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  return createPortal(contextMenu, document.body);
}