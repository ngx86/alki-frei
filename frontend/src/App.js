import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import logo from './images/logo.png';
import pointerIcon from './images/pointer.svg';
import './App.css';
import SearchBar from './components/Search/SearchBar';
import AddBeerForm from './components/Beer/AddBeerForm';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create a custom icon
const customBeerIcon = new L.Icon({
    iconUrl: pointerIcon,
    iconSize: [64, 64], // Doubled the size
    iconAnchor: [32, 64], // Adjusted anchor point
    popupAnchor: [0, -64], // Adjusted popup anchor
    className: 'custom-beer-icon' // Added a custom class for styling
});

function AddBeerMarker({ onAddBeer }) {
  useMapEvents({
    click(e) {
      onAddBeer(e.latlng);
    },
  });
  return null;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState([51.505, -0.09]); // London coordinates
  const [searchResult, setSearchResult] = useState(null);
  const [beers, setBeers] = useState([]);
  const [newBeer, setNewBeer] = useState(null);
  const [mapStyle, setMapStyle] = useState("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    // Load initial beer data from API
    const fetchBeers = async () => {
      try {
        const response = await axios.get('/api/beers');
        setBeers(response.data);
      } catch (error) {
        console.error('Error fetching beers:', error);
      }
    };
    fetchBeers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/search?q=${searchTerm}`);
      const searchResults = response.data;
      setBeers(searchResults);
      setSearchResult(`Found ${searchResults.length} results`);
      if (searchResults.length > 0) {
        const firstResult = searchResults[0];
        setPosition([firstResult.latlng.lat, firstResult.latlng.lng]);
        mapRef.current.setView([firstResult.latlng.lat, firstResult.latlng.lng], 13);
      }
    } catch (error) {
      console.error('Error searching beers:', error);
      setSearchResult("Error searching beers");
    }
  };

  const handleAddBeer = (latlng) => {
    setNewBeer({ latlng, name: '', type: '', city: '', establishment: '' });
  };

  const handleSaveBeer = async () => {
    if (newBeer && newBeer.name && newBeer.type && newBeer.city && newBeer.establishment) {
      try {
        const response = await axios.post('/api/beer', newBeer);
        const updatedBeers = [...beers, response.data.beer];
        setBeers(updatedBeers);
        setNewBeer(null);
      } catch (error) {
        console.error('Error adding beer:', error);
        alert('Failed to add beer. Please try again.');
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Logo (clickable) */}
      <div 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          cursor: 'pointer',
        }}
        onClick={() => setIsMenuOpen(true)}
      >
        <img src={logo} alt="Logo" className="app-logo" style={{ width: '100px' }} />
      </div>

      {/* Fly-out Menu */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: isMenuOpen ? 0 : '-300px',
          width: '300px',
          height: '100%',
          backgroundColor: 'white',
          boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
          transition: 'left 0.3s ease-in-out',
          zIndex: 1001,
          padding: '20px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Close button */}
        <div 
          className="menu-close-button"
          onClick={() => setIsMenuOpen(false)}
        >
          &times;
        </div>

        <h2>Menu</h2>
        <h3>About</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <h3>Map Style</h3>
        <select 
          onChange={(e) => setMapStyle(e.target.value)} 
          value={mapStyle}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
          }}
        >
          <option value="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png">CartoDB Positron</option>
          <option value="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">OpenStreetMap</option>
          <option value="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png">CartoDB Dark Matter</option>
        </select>
      </div>

      {/* Floating search window */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        maxWidth: '30%',
        width: '300px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          handleSearch={handleSearch} 
        />
        {searchResult && <p>Found: {searchResult}</p>}
        {newBeer && (
          <AddBeerForm 
            newBeer={newBeer} 
            setNewBeer={setNewBeer} 
            handleSaveBeer={handleSaveBeer} 
          />
        )}
      </div>

      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={mapStyle}
        />
        <Marker position={position}>
          <Popup>
            {searchResult || "A sample marker"}
          </Popup>
        </Marker>
        {beers.map((beer, index) => (
          <Marker 
            key={index} 
            position={[beer.latlng.lat, beer.latlng.lng]} 
            icon={customBeerIcon}
          >
            <Popup>
              <strong>{beer.name}</strong><br />
              Type: {beer.type}<br />
              City: {beer.city}<br />
              Establishment: {beer.establishment}
            </Popup>
          </Marker>
        ))}
        <AddBeerMarker onAddBeer={handleAddBeer} />
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default App;