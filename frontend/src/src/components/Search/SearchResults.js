import React from 'react';

function SearchResults({ results }) {
  return (
    <ul>
      {results.map((beer) => (
        <li key={beer.id}>
          {beer.name} - {beer.type} ({beer.city})
        </li>
      ))}
    </ul>
  );
}

export default SearchResults;