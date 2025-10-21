// File: /frontend/src/Board.js
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import List from './List'; // Pastikan nama file ini 'List.js' atau 'list.js' (sesuai file Anda)
import axios from 'axios';

function Board() {
  const [lists, setLists] = useState(null);

  useEffect(() => {
    axios.get('/api/board')
      .then(response => {
        const apiLists = response.data;
        const transformedLists = apiLists.reduce((acc, list) => {
          acc[list._id] = {
            title: list.title,
            cards: list.cards
          };
          return acc;
        }, {});
        setLists(transformedLists);
      })
      .catch(error => console.error("Gagal mengambil data board:", error));
  }, []);

  // --- SEMUA LOGIKA (sensors, findListIdOfCard, handleDragEnd) TETAP SAMA ---
  // (Biarkan saja, tidak perlu diubah)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findListIdOfCard = (cardId) => {
    if (!lists) return null;
    return Object.keys(lists).find(listId =>
      lists[listId].cards.some(card => card._id.toString() === cardId)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();
    if (activeId === overId) return;
    const sourceListId = findListIdOfCard(activeId);
    const isOverAList = lists.hasOwnProperty(overId);
    const destListId = isOverAList ? overId : findListIdOfCard(overId);
    if (!sourceListId || !destListId) return;

    setLists(prevLists => {
      const newLists = { ...prevLists };
      const sourceList = newLists[sourceListId];
      const destList = newLists[destListId];

      if (sourceListId === destListId) {
        const list = sourceList;
        const oldIndex = list.cards.findIndex(c => c._id.toString() === activeId);
        const newIndex = list.cards.findIndex(c => c._id.toString() === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          newLists[sourceListId] = {
            ...list,
            cards: arrayMove(list.cards, oldIndex, newIndex)
          };
        }
      } else {
        const sourceListCards = [...sourceList.cards];
        const destListCards = [...destList.cards];
        const sourceCardIndex = sourceListCards.findIndex(c => c._id.toString() === activeId);
        const [movedCard] = sourceListCards.splice(sourceCardIndex, 1);
        let destCardIndex;
        if (isOverAList) {
          destCardIndex = destListCards.length;
        } else {
          destCardIndex = destListCards.findIndex(c => c._id.toString() === overId);
          if (destCardIndex === -1) destCardIndex = 0;
        }
        destListCards.splice(destCardIndex, 0, movedCard);
        newLists[sourceListId] = { ...sourceList, cards: sourceListCards };
        newLists[destListId] = { ...destList, cards: destListCards };
      }
      return newLists;
    });

    let newIndex;
    const destListCards = lists[destListId].cards;
    if (isOverAList) {
      newIndex = destListCards.length;
    } else {
      newIndex = destListCards.findIndex(c => c._id.toString() === overId);
    }
    if (newIndex === -1) newIndex = 0;

    axios.put('/api/move', { 
      cardId: activeId,
      sourceListId: sourceListId,
      destListId: destListId,
      newIndex: newIndex
    })
    .catch(error => {
      console.error('Error saat update ke backend:', error);
    });
  };
  // --- BATAS LOGIKA ---

  if (!lists) {
    return (
      <div style={{ padding: '50px', fontSize: '24px', color: '#172b4d' }}>
        Loading papan...
      </div>
    );
  }

  // --- INI BAGIAN RENDER YANG DIPERBARUI ---
  // Pisahkan list "Inbox" dari list lainnya
  const inboxListEntry = Object.entries(lists).find(([id, list]) => list.title === 'Inbox');
  const otherListEntries = Object.entries(lists).filter(([id, list]) => list.title !== 'Inbox');

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-layout">
        
        {/* === Bagian Sidebar Biru (Hanya berisi "Inbox") === */}
        <div className="sidebar-section">
          {inboxListEntry && (
            <List
              key={inboxListEntry[0]}
              listId={inboxListEntry[0]}
              list={inboxListEntry[1]}
              lists={lists}
              setLists={setLists}
              isSidebar={true} // Memberi tanda ini adalah sidebar
            />
          )}
          {/* Nanti bisa diisi gambar dinosaurus */}
        </div>

        {/* === Bagian Papan Utama Ungu (Berisi "To Do", "In Progress", "Done") === */}
        <div className="main-board-section">
          <div className="board-title-chip">Your Board</div>
          
          <div className="main-board-columns">
            {/* Render sisa list ('To Do', 'In Progress', 'Done', dll) */}
            {otherListEntries.map(([listId, list]) => (
              <List
                key={listId}
                listId={listId}
                list={list}
                lists={lists}
                setLists={setLists}
                isSidebar={false} // Ini adalah list normal (kotak pink)
              />
            ))}
          </div>
          {/* Nanti bisa diisi gambar Squidward */}
        </div>

      </div>
    </DndContext>
  );
}

export default Board;