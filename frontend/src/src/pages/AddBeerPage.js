import React from 'react';
import AddBeerForm from '../components/Beer/AddBeerForm';
import { addBeer } from '../services/api';

function AddBeerPage() {
  const handleSubmit = async (beerData) => {
    try {
      await addBeer(beerData);
      alert('Beer added successfully!');
    } catch (error) {
      console.error('Error adding beer:', error);
      alert('Failed to add beer. Please try again.');
    }
  };

  return (
    <div>
      <h1>Add New Beer</h1>
      <AddBeerForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddBeerPage;
