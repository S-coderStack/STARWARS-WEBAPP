function saveSearchToHistory(searchTerm) {
    let history = loadFromLocalStorage("searchHistory") || [];
    const historyItem = {
        term: searchTerm,
        timestamp: new Date().getTime(),
        date: new Date().toLocaleString()
    };
    
    // Evitar duplicados recientes (mismo término en los últimos 5 minutos)
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    history = history.filter(item => 
        item.term.toLowerCase() !== searchTerm.toLowerCase() || item.timestamp < fiveMinutesAgo
    );
    
    history.unshift(historyItem);
    // Mantener solo las últimas 10 búsquedas
    history = history.slice(0, 10);
    saveToLocalStorage("searchHistory", history);
}

function showSearchHistory() {
    const history = loadFromLocalStorage("searchHistory") || [];
    const historySection = document.getElementById("historySection");
    const historyContainer = document.getElementById("historyContainer");
    
    // Ocultar otras secciones
    document.getElementById("favoritesSection").classList.add("hidden");
    document.getElementById("results").innerHTML = "";
    document.getElementById("pagination").classList.add("hidden");
    
    // Mostrar sección de historial
    historySection.classList.remove("hidden");
    
    if (history.length === 0) {
        historyContainer.innerHTML = "<p class='no-history'>No hay búsquedas recientes.</p>";
        return;
    }
    
    // Crear lista de historial
    historyContainer.innerHTML = "";
    history.forEach(item => {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        
        const timeAgo = getTimeAgo(item.timestamp);
        
        historyItem.innerHTML = `
            <div class="history-content">
                <div class="history-term">
                    <i class="fas fa-search"></i>
                    <span>${item.term}</span>
                </div>
                <div class="history-time">
                    <i class="fas fa-clock"></i>
                    <span>${timeAgo}</span>
                </div>
            </div>
            <div class="history-actions">
                <button onclick="performHistorySearch('${item.term}')" class="history-search-btn">
                    <i class="fas fa-redo"></i> Buscar
                </button>
                <button onclick="removeFromHistory('${item.timestamp}')" class="history-delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        historyContainer.appendChild(historyItem);
    });
}

function removeFromHistory(timestamp) {
    let history = loadFromLocalStorage("searchHistory") || [];
    history = history.filter(item => item.timestamp !== timestamp);
    saveToLocalStorage("searchHistory", history);
    showSearchHistory(); // Actualizar la vista
}

function performHistorySearch(term) {
    // Ocultar sección de historial
    document.getElementById("historySection").classList.add("hidden");
    
    // Establecer el término de búsqueda
    document.getElementById("searchInput").value = term;
    
    // Realizar la búsqueda
    const searchButton = document.getElementById("searchButton");
    searchButton.click();
}

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convertir a segundos
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
        return "Hace un momento";
    }
    
    // Convertir a minutos
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Convertir a horas
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Convertir a días
    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
    
    // Si es más antiguo, mostrar la fecha completa
    return new Date(timestamp).toLocaleString();
}

// Exponer funciones globalmente
window.showSearchHistory = showSearchHistory;
window.performHistorySearch = performHistorySearch;
window.removeFromHistory = removeFromHistory;
