import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteForm = ({ selectedNote, fetchNotes }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Predefined categories list
  const categories = ['Work', 'Personal', 'Ideas', 'Important'];

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setCategory(selectedNote.category || '');
      setIsEditing(true); // Mark as editing if we are updating an existing note
    } else {
      setIsEditing(false); // Reset editing state if creating a new note
    }
  }, [selectedNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const noteData = { title, content, category };

    try {
      if (isEditing) {
        // If editing an existing note
        await axios.put(`http://localhost:5000/api/notes/${selectedNote._id}`, noteData);
      } else {
        // If creating a new note
        await axios.post('http://localhost:5000/api/notes', noteData);
      }

      fetchNotes(); // Refresh the notes list after submission
      resetForm(); // Reset the form fields after submit
    } catch (error) {
      console.error("Error while saving the note", error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <button type="submit">{isEditing ? 'Update Note' : 'Create Note'}</button>
      </div>
    </form>
  );
};

export default NoteForm;
