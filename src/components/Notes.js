import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteForm from './NoteForm';
import '../index.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [summary, setSummary] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Add state for the search query
  const [sentiment, setSentiment] = useState(''); // Add state for sentiment analysis result
  const [showSentimentModal, setShowSentimentModal] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch all notes or filtered notes from the backend
  const fetchNotes = async (query = '') => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes', { params: { search: query } });
      setNotes(response.data);
    } catch (error) {
      console.error("There was an error fetching the notes", error);
    }
  };

  // Handle delete note
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      fetchNotes(searchQuery); // Refresh the list after deletion and preserve the search query
    } catch (error) {
      console.error("There was an error deleting the note", error);
    }
  };

  // Handle editing note (set it for editing)
  const handleEdit = (note) => {
    setSelectedNote(note);
  };

  // Handle summarize note
  const handleSummarize = async (content) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/summarize', { text: content });
      const summary = response.data[0].summary_text;
      setSummary(summary); // Set the summary
      setShowSummaryModal(true); // Show the modal with the summary
    } catch (error) {
      console.error("There was an error summarizing the note", error);
    }
  };

  // Handle sentiment analysis
  const handleSentimentAnalysis = async (content) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/sentiment', { text: content });
      console.log(response.data);
      setSentiment(response.data.label); // Set the sentiment result
      setShowSentimentModal(true);
    } catch (error) {
      console.error("There was an error analyzing sentiment", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update search query state
    fetchNotes(query); // Call fetchNotes with the search query
  };

  // Close the summary modal
  const closeSummaryModal = () => {
    setShowSummaryModal(false);
    setSummary('');
  };

  // Close the sentiment modal
  const closeSentimentModal = () => {
    setShowSentimentModal(false);
    setSentiment(null);
  };

  // Close the modal if clicked outside
  const handleOutsideClick = (event) => {
    const modal = document.getElementById('summaryModal');
    if (modal && !modal.contains(event.target)) {
      closeSummaryModal();
    }
  };

  // Add event listener when the modal is shown
  useEffect(() => {
    if (showSentimentModal) {
      window.addEventListener('click', handleOutsideClick);
    } else {
      window.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showSentimentModal]);

  // Add event listener when modal is shown
  useEffect(() => {
    if (showSummaryModal) {
      window.addEventListener('click', handleOutsideClick);
    } else {
      window.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showSummaryModal]);

  return (
    <div className="notes-container">
      <div className="form-container">
        <h2>Create New Note</h2>
        <NoteForm selectedNote={selectedNote} fetchNotes={fetchNotes} />
      </div>

      <div className="notes-list">
        <h2>Notes List</h2>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search notes..."
          />
        </div>
        <ul>
          {notes.map((note) => (
            <li key={note._id} className="note-item">
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className="note-category">{note.category}</span>
              </div>
              <p>{note.content}</p>
              {/* <small>{note.category}</small> */}
              <div className="buttons">
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button onClick={() => handleDelete(note._id)}>Delete</button>
                <button onClick={() => handleSummarize(note.content)}>Summarize</button>
                <button onClick={() => handleSentimentAnalysis(note.content)}>Analyze Sentiment</button>
              </div>
            </li>
          ))}
        </ul>
        </div>

        {/* Sentiment Modal */}
        {showSentimentModal && (
            <div id="sentimentModal" className="modal">
            <div className="modal-content">
                <h3>Sentiment Analysis</h3>
                {sentiment ? (
                <div>
                    <p><strong>Sentiment:</strong> {sentiment}</p>
                </div>
                ) : (
                <p>Loading sentiment...</p>
                )}
                <button className="close-button" onClick={closeSentimentModal}>Close</button>
            </div>
            </div>
        )}
      
      {/* Modal for displaying the summary */}
      {showSummaryModal && (
        <div id="summaryModal" className="modal">
          <div className="modal-content">
            <h3>Summary</h3>
            <p>{summary}</p>
            <button className="close-button" onClick={closeSummaryModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
