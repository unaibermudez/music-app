import { getToken } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');
    
    if (artistId) {
        const token = await getToken();
        const artist = await getArtistById(token, artistId);
        const topTracks = await getTopTracksByArtistId(token, artistId);

        // Left Column: Artist Details
        const artistDetails = document.getElementById('left-column');
        artistDetails.innerHTML = `
            <div class="artist-details">
                <div class="artist-name">
                    <h1>${artist.name}</h1>
                </div>
                <div class="artist-info">
                    <div class="artist-image">
                        <img src="${artist.images[0]?.url || 'https://via.placeholder.com/100'}" alt="${artist.name}">
                    </div>
                    <div class="artist-stats">
                        <p>Followers: ${artist.followers.total.toLocaleString()}</p>
                        <p>Genres: ${artist.genres.join(', ')}</p>
                        <p>Popularity: ${artist.popularity}</p>
                    </div>
                </div>
            </div>
            
            <div class="top-songs">
                <h2>Top 5 Songs</h2>
                <div id="top-tracks">
                    ${topTracks.map(track => `
                        <div class="track-card">
                            <img src="${track.album.images[0]?.url || 'https://via.placeholder.com/50'}" alt="${track.name}">
                            <div class="track-info">
                                <h3>${track.name}</h3>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Right Column: Song Searcher
        const songSearcher = document.getElementById('song-search');
        songSearcher.innerHTML = `
            <div class="song-search-container">
                <h2>Search Songs by ${artist.name}</h2>
                <input type="text" id="search-input" placeholder="Search for a song...">
                <button id="search-button">Search</button>
                <div id="search-results"></div>
            </div>
        `;

        document.getElementById('search-button').addEventListener('click', async () => {
            const query = document.getElementById('search-input').value.trim();
            if (query) {
                const searchResults = await searchSongsByArtist(token, artistId, query);
                displaySearchResults(searchResults);
            }
        });

    } else {
        console.error('Artist ID not found in URL');
    }

});

async function getArtistById(token, artistId) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

async function getTopTracksByArtistId(token, artistId) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.tracks.slice(0, 5);
}

async function searchSongsByArtist(token, artistId, query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}%20artist:${artistId}&type=track&market=ES`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.tracks.items;
}

function displaySearchResults(tracks) {
    const resultsContainer = document.getElementById('search-results');
    if (tracks.length > 0) {
        resultsContainer.innerHTML = tracks.map(track => `
            <div class="track-card">
                <img src="${track.album.images[0]?.url || 'https://via.placeholder.com/50'}" alt="${track.name}">
                <div class="track-info">
                    <h3>${track.name}</h3>
                    <p>${track.album.name}</p>
                </div>
            </div>
        `).join('');
    } else {
        resultsContainer.innerHTML = '<p>No songs found.</p>';
    }
}
