// File: /frontend/src/List.js
import React, { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import Card from './card'; // Impor 'card.js' (huruf kecil)
import axios from 'axios';

// Terima prop 'isSidebar' dengan default 'false'
function List({ listId, list, lists, setLists, isSidebar = false }) {
  const { setNodeRef } = useDroppable({
    id: listId.toString(),
  });

  const [newCardTitle, setNewCardTitle] = useState('');
  // State baru untuk menampilkan form di sidebar
  const [isAddingCard, setIsAddingCard] = useState(false);

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

      // Reset state
      setNewCardTitle('');
      setIsAddingCard(false); // Tutup form setelah sukses
    })
    .catch(error => {
      console.error('Gagal menambah kartu:', error);
    });
  };

  const cardIds = list.cards.map(card => card._id.toString());

  return (
    <div className={isSidebar ? 'list-sidebar-style' : 'list-container'}>
      
      {/* Ganti style judul jika 'isSidebar' */}
      <h2 className={isSidebar ? 'list-sidebar-title' : 'list-title'}>
        {list.title}
      </h2>

      <SortableContext
        id={listId.toString()}
        items={cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          style={{ minHeight: 100, paddingBottom: '10px' }}
        >
          {list.cards.map((card) => (
            <Card key={card._id.toString()} card={card} />
          ))}
        </div>
      </SortableContext>

      {/* --- Logika Form Tambah Kartu yang Baru --- */}
      {isSidebar ? (
        // --- TAMPILAN SIDEBAR ---
        <>
          {!isAddingCard ? (
            // 1. Tombol palsu "add new card"
            <div 
              className="add-card-sidebar-button" 
              onClick={() => setIsAddingCard(true)}
            >
              add new card
              <span style={{ float: 'right' }}>{/* Nanti bisa diisi ikon amplop */}</span>
            </div>
          ) : (
            // 2. Form yang muncul saat di-klik
            <form className="add-card-form" onSubmit={handleAddCard}>
              <input
                type="text"
                className="add-card-input"
                placeholder="Masukkan judul kartu..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                autoFocus // Langsung fokus ke input
              />
              <button type="submit" className="add-card-button">
                Tambah
              </button>
              <button 
                type="button" 
                className="cancel-card-button" 
                onClick={() => setIsAddingCard(false)}
              >
                Batal
              </button>
            </form>
          )}
        </>
      ) : (
        // --- TAMPILAN BOARD (Tetap sama) ---
        <form className="add-card-form" onSubmit={handleAddCard}>
          <input
            type="text"
            className="add-card-input"
            placeholder="Masukkan judul kartu..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
          />
          <button type="submit" className="add-card-button">
            Tambah Kartu
          </button>
        </form>
      )}
    </div>
  );
}

export default List;