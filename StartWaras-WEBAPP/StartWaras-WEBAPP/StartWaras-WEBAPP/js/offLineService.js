function handleOfflineMode() {
    window.addEventListener("offline", () => {
        alert("¡Estás sin conexión! Mostrando últimos datos guardados...");
        const data = loadFromLocalStorage("lastSearch");
        if (data) renderResults(data.items, data.type);
    });
}
