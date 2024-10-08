import { getToken } from './auth.js';
async function searchForArtist(token, artistName) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=5`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.artists.items;
}

async function displayArtist() {
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const searchingText = document.getElementById('searchingText');
    const artistContainer = document.getElementById('artistContainer');
    artistContainer.innerHTML = ''; // Limpiar contenedor

    const artistName = searchBar.value;
    if (!artistName) return;

    // Deshabilitar barra de búsqueda y botón, mostrar texto de búsqueda
    searchBar.disabled = true;
    searchButton.disabled = true;
    searchingText.style.display = 'block';

    const token = await getToken();
    const artists = await searchForArtist(token, artistName);
    
    if (Array.isArray(artists)) {
        artists.forEach(artist => {
            const artistLink = document.createElement('a');
            artistLink.href = `artist.html?id=${artist.id}`;
            artistLink.classList.add('artist-link');
    
            const artistCard = document.createElement('div');
            artistCard.classList.add('artist-card');
            artistCard.innerHTML = `
                <img src="${artist.images[0]?.url || 'https://via.placeholder.com/100'}" alt="${artist.name}">
                <div class="artist-info">
                    <h3>${artist.name}</h3>
                    <p>Followers: ${artist.followers.total.toLocaleString()}</p>
                    <p>Genres: ${artist.genres.join(', ')}</p>
                    <p>Popularity: ${artist.popularity}</p>
                </div>
            `;
    
            artistLink.appendChild(artistCard);
            artistContainer.appendChild(artistLink);
        });
    } else {
        console.error('Expected an array of artists');
    }
    
    // Rehabilitar barra de búsqueda y botón, ocultar texto de búsqueda
    searchBar.disabled = false;
    searchButton.disabled = false;
    searchingText.style.display = 'none';

    // Rehabilitar barra de búsqueda y botón, ocultar texto de búsqueda
    searchBar.disabled = false;
    searchButton.disabled = false;
    searchingText.style.display = 'none';
}

document.getElementById('searchButton').addEventListener('click', displayArtist);

document.getElementById('searchBar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        displayArtist();
    }
});