function addToFavorites(name, type, id) {
    let favorites = loadFromLocalStorage("favorites") || [];
    const favoriteItem = {
        name,
        type,
        id,
        timestamp: new Date().getTime()
    };
    
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push(favoriteItem);
        saveToLocalStorage("favorites", favorites);
        showFavorites();
    }
}

function removeFromFavorites(id) {
    let favorites = loadFromLocalStorage("favorites") || [];
    favorites = favorites.filter(fav => fav.id !== id);
    saveToLocalStorage("favorites", favorites);
    showFavorites();
}

function showFavorites() {
    const favorites = loadFromLocalStorage("favorites") || [];
    const favoritesContainer = document.getElementById("favoritesContainer");
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No tienes favoritos aún.</p>";
        return;
    }

    // Sort favorites by most recent first
    favorites.sort((a, b) => b.timestamp - a.timestamp);
    
    // Create a grid of favorite cards
    favoritesContainer.innerHTML = "";
    favorites.forEach(favorite => {
        const card = document.createElement("div");
        card.classList.add("character-card");
        
        const imageUrl = getImageUrl(favorite.type, favorite.id);
        
        let content = `
            <img src="${imageUrl}" alt="${favorite.name}" onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
            <h3>${favorite.name}</h3>
            <button onclick="removeFromFavorites('${favorite.id}')">❌ Eliminar</button>`;
        
        card.innerHTML = content;
        favoritesContainer.appendChild(card);
    });
}

// Exponer funciones globalmente
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.showFavorites = showFavorites;
