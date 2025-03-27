"use strict";

const fetchCities = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/cities');
    const data = await response.json();
    populateTable(data);
  } catch (error) {
    console.log(error);
  }
};

const populateTable = (data) => {
  const tbody = document.querySelector('#cities-table tbody');
  tbody.innerHTML = ''; // Clear existing rows
  data.map(item => {
    const row = document.createElement('tr');
    
    const idColumn = document.createElement('td');
    idColumn.className = "column-id";
    idColumn.innerText = item.id;
    row.appendChild(idColumn);
    
    const nameColumn = document.createElement('td');
    nameColumn.className = "column-name";
    nameColumn.innerText = item.city;
    row.appendChild(nameColumn);
    
    const countryColumn = document.createElement('td');
    countryColumn.className = "column-country";
    countryColumn.innerText = item.country;
    row.appendChild(countryColumn);
    
    tbody.appendChild(row);
  });
};

const addCity = async (city, country) => {
  try {
    const response = await fetch('http://localhost:3000/api/cities/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, country })
    });
    if (!response.ok) throw new Error('Failed to add city');
    fetchCities(); // Refresh the table after adding
  } catch (error) {
    console.log(error);
  }
};

// Form submission handler
document.getElementById('add-city-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('city-input').value;
  const country = document.getElementById('country-input').value;
  addCity(city, country);
  e.target.reset(); // Clear the form
});

// Initial fetch
fetchCities();