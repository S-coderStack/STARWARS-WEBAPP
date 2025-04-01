document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resultsContainer = document.getElementById("results");
    const favoritesSection = document.getElementById("favoritesSection");
    const modal = document.getElementById("detailsModal");
    const closeModal = document.querySelector(".close");

    let currentPage = 1;
    let currentCategory = null;
    let searchTimeout;

    // Modal close functionality
    closeModal.onclick = () => modal.classList.add("hidden");
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    };

    async function performSearch() {
        const name = searchInput.value.trim();
        
        if (name === "") {
            clearResults();
            return;
        }

        showLoadingIndicator(true);

        const people = await fetchData("people", name);
        const starships = await fetchData("starships", name);

        showLoadingIndicator(false);

        if (people.results.length === 0 && starships.results.length === 0) {
            clearResults();
            return;
        }

        const results = people.results.length > 0 ? people : starships;
        saveToLocalStorage("lastSearch", results);
        saveSearchToHistory(name);
        renderResults(results.results, people.results.length > 0 ? "people" : "starships");
    }

    async function loadAllItems(category) {
        currentCategory = category;
        currentPage = 1;
        await loadPage(currentPage);
    }

    async function loadPage(page) {
        showLoadingIndicator(true);
        const data = await fetchData(currentCategory, "", page);
        showLoadingIndicator(false);

        if (data) {
            renderResults(data.results, currentCategory);
            updatePagination(data.total, page, loadPage);
        }
    }

    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);

        if (searchInput.value.trim() === "") {
            clearResults();
            return;
        }

        searchTimeout = setTimeout(performSearch, 500);
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    searchButton.addEventListener("click", performSearch);

    // Event listeners for new buttons
    document.getElementById("loadAllCharacters").addEventListener("click", () => loadAllItems("people"));
    document.getElementById("loadAllShips").addEventListener("click", () => loadAllItems("starships"));
    
    document.getElementById("showFavorites").addEventListener("click", () => {
        favoritesSection.classList.toggle("hidden");
        if (!favoritesSection.classList.contains("hidden")) {
            showFavorites();
        }
    });

    document.getElementById("showHistory").addEventListener("click", showSearchHistory);
    document.getElementById("toggleDarkMode").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    handleOfflineMode();

    function showLoadingIndicator(show) {
        if (show) {
            resultsContainer.innerHTML = "<p class='loading'>Cargando resultados...</p>";
        } else {
            resultsContainer.innerHTML = "";
        }
    }

    function clearResults() {
        resultsContainer.innerHTML = "";
        document.getElementById("pagination").classList.add("hidden");
    }
});

// Función para guardar en LocalStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Función para cargar desde LocalStorage
function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Función para guardar en el historial de búsqueda
function saveSearchToHistory(searchTerm) {
    let history = loadFromLocalStorage("searchHistory");
    if (!history.includes(searchTerm)) {
        history.push(searchTerm);
        saveToLocalStorage("searchHistory", history);
    }
}
