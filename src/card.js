// File: /frontend/src/card.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Tambahkan 'isSidebar'
function Card({ card, isSidebar = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // Gunakan className kondisional
      className={isSidebar ? 'sidebar-card-container' : 'card-container'}
    >
      {card.title}
    </div>
  );
}

export default Card;