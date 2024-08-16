import { getToken } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Artist details page loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');
    console.log(artistId);
    
    if (artistId) {
        const token = await getToken();
        const artist = await getArtistById(token, artistId);
        const topTracks = await getTopTracksByArtistId(token, artistId);

        const artistDetails = document.getElementById('artist-details');
        artistDetails.innerHTML = `
            <div class="left-column">
                <h1>${artist.name}</h1>
                <img src="${artist.images[0]?.url || 'https://via.placeholder.com/100'}" alt="${artist.name}">
                <p>Followers: ${artist.followers.total.toLocaleString()}</p>
                <p>Genres: ${artist.genres.join(', ')}</p>
                <p>Popularity: ${artist.popularity}</p>
            </div>
            <div class="right-column">
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
