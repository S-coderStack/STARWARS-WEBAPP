document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchButton").addEventListener("click", async () => {
        const name = document.getElementById("searchInput").value;
        if (name.trim() === "") return;

        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = `<p class="loading">Cargando datos...</p>`; // 🔹 Muestra el indicador de carga

        try {
            const people = await fetchData("people", name);
            const starships = await fetchData("starships", name);

            const results = people.length > 0 ? { items: people, type: "people" } : { items: starships, type: "starships" };
            saveToLocalStorage("lastSearch", results);
            saveSearchToHistory(name);

            resultsContainer.innerHTML = ""; // 🔹 Limpia el mensaje de carga antes de mostrar resultados
            renderResults(results.items, results.type);
        } catch (error) {
            resultsContainer.innerHTML = `<p class="error">Error al cargar los datos</p>`; // 🔹 Muestra error si la API falla
        }
    });

    document.getElementById("showFavorites").addEventListener("click", showFavorites);
    document.getElementById("showHistory").addEventListener("click", showSearchHistory);
    document.getElementById("toggleDarkMode").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    handleOfflineMode();
});

// 🔹 Funciones de almacenamiento local (sin cambios)
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}
