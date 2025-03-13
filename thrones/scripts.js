// Define the API URL
const apiUrl = 'https://thronesapi.com/api/v2/Characters';

// Get DOM elements
const characterNav = document.getElementById('character-nav');
const characterModal = document.getElementById('character-modal');
const characterDetails = document.getElementById('character-details');
const closeModal = document.getElementById('close-modal');
const searchInput = document.getElementById('search-input');
let charactersData = []; // Store fetched characters globally

// Function to create a labeled paragraph
function createLabeledParagraph(label, value) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    return p;
}

// Function to create a labeled link paragraph (for imageUrl)
function createLinkParagraph(label, url) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = url;
    p.appendChild(strong);
    p.appendChild(a);
    return p;
}

// Function to display character details in modal
function displayCharacterDetails(character) {
    characterDetails.replaceChildren(); // Clear previous content
    
    const img = document.createElement('img');
    img.src = character.imageUrl;
    img.alt = character.fullName;

    const id = createLabeledParagraph('ID', character.id);
    const firstName = createLabeledParagraph('First Name', character.firstName);
    const lastName = createLabeledParagraph('Last Name', character.lastName);
    const fullName = createLabeledParagraph('Full Name', character.fullName);
    const title = createLabeledParagraph('Title', character.title);
    const family = createLabeledParagraph('Family', character.family);
    const image = createLabeledParagraph('Image', character.image);
    const imageUrl = createLinkParagraph('Image URL', character.imageUrl);

    characterDetails.appendChild(img);
    characterDetails.appendChild(id);
    characterDetails.appendChild(firstName);
    characterDetails.appendChild(lastName);
    characterDetails.appendChild(fullName);
    characterDetails.appendChild(title);
    characterDetails.appendChild(family);
    characterDetails.appendChild(image);
    characterDetails.appendChild(imageUrl);

    characterModal.classList.add('active'); // Show modal
}

// Function to populate the navigation list with images
function populateNav(characters) {
    const ul = document.createElement('ul');
    characters.forEach((character, index) => {
        const li = document.createElement('li');
        
        // Add small image
        const img = document.createElement('img');
        img.src = character.imageUrl;
        img.alt = character.fullName;
        li.appendChild(img);

        // Add name
        const nameSpan = document.createElement('span');
        nameSpan.textContent = character.fullName;
        li.appendChild(nameSpan);

        li.addEventListener('click', () => {
            document.querySelectorAll('.character-nav li').forEach(item => {
                item.classList.remove('active');
            });
            li.classList.add('active');
            displayCharacterDetails(character);
        });
        ul.appendChild(li);

        if (index === 0) {
            li.classList.add('active');
        }
    });
    characterNav.replaceChildren(ul);
}

// Function to filter characters based on search input
function filterCharacters(query) {
    const filtered = charactersData.filter(character => 
        character.fullName.toLowerCase().includes(query.toLowerCase())
    );
    populateNav(filtered);
}

// Function to fetch characters
async function fetchCharacters() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        charactersData = await response.json();
        populateNav(charactersData); // Initial population
    } catch (error) {
        console.error('Error fetching characters:', error);
        const errorP = document.createElement('p');
        errorP.textContent = 'Sorry, something went wrong while fetching the data.';
        characterDetails.replaceChildren(errorP);
        characterModal.classList.add('active');
    }
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    filterCharacters(e.target.value);
});

closeModal.addEventListener('click', () => {
    characterModal.classList.remove('active');
});

// Click outside modal to close
characterModal.addEventListener('click', (e) => {
    if (e.target === characterModal) {
        characterModal.classList.remove('active');
    }
});

// Call the function when the page loads
fetchCharacters();