import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by beer, location, bar..."
        className="search-input"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;