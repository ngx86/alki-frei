import React, { useState } from 'react';
import SearchBar from '../components/Search/SearchBar';
import SearchResults from '../components/Search/SearchResults';
import { searchBeers } from '../services/api';

function SearchPage() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    try {
      const data = await searchBeers(query);
      setResults(data);
    } catch (error) {
      console.error('Error searching beers:', error);
    }
  };

  return (
    <div>
      <h1>Search Beers</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={results} />
    </div>
  );
}

export default SearchPage;
