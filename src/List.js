// File: /frontend/src/List.js
import React, { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import Card from './card'; // Impor 'card.js' (huruf kecil)
import axios from 'axios';

function List({ listId, list, lists, setLists, isSidebar = false }) {
  const { setNodeRef } = useDroppable({
    id: listId.toString(),
  });

  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false); // Untuk form di papan

  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCardTitle.trim() === '') return;

    axios.post('/api/cards', {
      title: newCardTitle,
      listId: listId
    })
    .then(response => {
      const newCard = response.data;
      const updatedList = { ...list, cards: [...list.cards, newCard] };
      setLists({ ...lists, [listId]: updatedList });

      setNewCardTitle('');
      setIsAddingCard(false); // Reset/tutup form
    })
    .catch(error => {
      console.error('Gagal menambah kartu:', error);
    });
  };

  const cardIds = list.cards.map(card => card._id.toString());

  // --- KITA PISAHKAN JSX-NYA AGAR LEBIH RAPI ---

  // 1. JSX untuk daftar kartu (selalu sama)
  const cardListContent = (
    <SortableContext
      id={listId.toString()}
      items={cardIds}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        style={{ minHeight: '40px', paddingBottom: '10px' }} // Beri min-height kecil
      >
        {list.cards.map((card) => (
          // Teruskan prop 'isSidebar' ke Card
          <Card key={card._id.toString()} card={card} isSidebar={isSidebar} />
        ))}
      </div>
    </SortableContext>
  );

  // 2. JSX untuk area "Tambah Kartu"
  const addCardAreaContent = (
    <div className="add-card-area">
      {isSidebar ? (
        // --- TAMPILAN SIDEBAR (Form Selalu Terbuka) ---
        <form className="add-card-form-sidebar" onSubmit={handleAddCard}>
          <input
            type="text"
            className="add-card-input-sidebar"
            placeholder="Add a card" // Placeholder baru
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
          />
          {/* Tombol submit disembunyikan, user tekan Enter */}
          <button type="submit" style={{ display: 'none' }} />
        </form>
      ) : (
        // --- TAMPILAN BOARD (Trello-style Toggle) ---
        <>
          {isAddingCard ? (
            <form className="add-card-form-toggled" onSubmit={handleAddCard}>
              <input
                type="text"
                className="add-card-input"
                placeholder="Enter a title..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                autoFocus
              />
              <div className="add-card-form-controls">
                <button type="submit" className="add-card-button">
                  Add card
                </button>
                <button
                  type="button"
                  className="cancel-card-button"
                  onClick={() => setIsAddingCard(false)}
                >
                  &times;
                </button>
              </div>
            </form>
          ) : (
            <button
              className="add-card-toggle-button"
              onClick={() => setIsAddingCard(true)}
            >
              + Add a card
            </button>
          )}
        </>
      )}
    </div>
  );

  // --- RENDER UTAMA ---
  return (
    <div className={isSidebar ? 'list-sidebar-style' : 'list-container'}>
      <h2 className={isSidebar ? 'list-sidebar-title' : 'list-title'}>
        {list.title}
      </h2>

      {/* Logika Tampilan Baru:
          - Sidebar: Form dulu, baru kartu
          - Board: Kartu dulu, baru form
      */}
      {isSidebar ? addCardAreaContent : cardListContent}
      {isSidebar ? cardListContent : addCardAreaContent}

    </div>
  );
}

export default List;