const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const CITIES = [
    {
      id: 1,
      city: 'Oslo',
      country: 'Norway',
    },
    {
      id: 2,
      city: 'Paris',
      country: 'France',
    },
    {
      id: 3,
      city: 'Pretoria',
      country: 'South Africa',
    },
];
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies from POST requests

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server!');
});

// API route
app.get('/api/', (req, res) => {
  res.send('👋 Hello Backend API 👋');
});

// Get all cities
app.get('/api/cities/', (req, res) => {
    res.status(200).send(CITIES);
});

// Get city by ID
app.get('/api/cities/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const city = CITIES.find(item => item.id === id);
    
    if (city) {
        res.status(200).send(city);
    } else {
        res.status(404).send({ error: 'City not found' });
    }
});

// Add a new city (POST endpoint)
app.post('/api/cities/', (req, res) => {
  const { city, country } = req.body;

  // Basic validation
  if (!city || !country) {
      return res.status(400).send({ error: 'City and country are required' });
  }

  // Generate a new ID (simple increment based on max existing ID)
  const newId = CITIES.length > 0 ? Math.max(...CITIES.map(c => c.id)) + 1 : 1;
  const newCity = { id: newId, city, country };

  // Add to the array
  CITIES.push(newCity);
  
  // Respond with the newly created city
  res.status(201).send(newCity);
});


app.listen(PORT, () => {
  console.log(`BACKEND SERVER LISTENING ON PORT ${PORT}`);
});