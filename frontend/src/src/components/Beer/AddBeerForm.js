import React, { useState } from 'react';

function AddBeerForm({ onSubmit, initialData = {} }) {
  const [beerData, setBeerData] = useState({
    name: '',
    type: '',
    city: '',
    establishment: '',
    ...initialData
  });

  const handleChange = (e) => {
    setBeerData({ ...beerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(beerData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={beerData.name}
        onChange={handleChange}
        placeholder="Beer Name"
        required
      />
      <input
        type="text"
        name="type"
        value={beerData.type}
        onChange={handleChange}
        placeholder="Beer Type"
        required
      />
      <input
        type="text"
        name="city"
        value={beerData.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <input
        type="text"
        name="establishment"
        value={beerData.establishment}
        onChange={handleChange}
        placeholder="Establishment Type"
        required
      />
      <button type="submit">Save Beer</button>
    </form>
  );
}

export default AddBeerForm;