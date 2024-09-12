import React from 'react';

function BeerList({ beers }) {
  return (
    <ul>
      {beers.map((beer) => (
        <li key={beer.id}>
          {beer.beer_name} - {beer.brewery_name} ({beer.style})
        </li>
      ))}
    </ul>
  );
}

export default BeerList;