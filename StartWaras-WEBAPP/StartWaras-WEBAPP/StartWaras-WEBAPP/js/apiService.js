const API_BASE = "https://swapi.dev/api/";
const IMAGE_BASE = "https://starwars-visualguide.com/assets/img/";

// URLs de placeholders para diferentes categorías
const PLACEHOLDERS = {
    people: "https://starwars-visualguide.com/assets/img/placeholder.jpg",
    starships: "https://starwars-visualguide.com/assets/img/placeholder-starship.jpg",
    vehicles: "https://starwars-visualguide.com/assets/img/placeholder-vehicle.jpg",
    planets: "https://starwars-visualguide.com/assets/img/placeholder-planet.jpg"
};

// Mapeo de categorías SWAPI a categorías de imágenes
const IMAGE_CATEGORIES = {
    people: "characters",
    starships: "starships",
    vehicles: "vehicles",
    planets: "planets"
};

async function fetchData(category, name = "", page = 1) {
    try {
        const url = name 
            ? `${API_BASE}${category}/?search=${name}`
            : `${API_BASE}${category}/?page=${page}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("API no disponible");
        const data = await response.json();
        return {
            results: data.results,
            total: data.count,
            next: data.next,
            previous: data.previous
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getImageUrl(category, id) {
    const imageCategory = IMAGE_CATEGORIES[category] || "characters";
    return `${IMAGE_BASE}${imageCategory}/${id}.jpg`;
}

function getPlaceholderUrl(category) {
    return PLACEHOLDERS[category] || PLACEHOLDERS.people;
}

// Función para obtener el ID de la URL de SWAPI
function getIdFromUrl(url) {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : null;
}

// Función para verificar si una imagen existe
async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('Error checking image:', error);
        return false;
    }
}

// Función para cargar una imagen con fallback
async function loadImageWithFallback(imageUrl, placeholderUrl, onLoad, onError) {
    const img = new Image();
    
    img.onload = () => {
        onLoad(img);
    };
    
    img.onerror = () => {
        console.log('Image failed to load, using placeholder:', imageUrl);
        img.src = placeholderUrl;
        onError(img);
    };
    
    img.src = imageUrl;
}

window.fetchData = fetchData;
window.getImageUrl = getImageUrl;
window.getPlaceholderUrl = getPlaceholderUrl;
window.getIdFromUrl = getIdFromUrl;
window.checkImageExists = checkImageExists;
window.loadImageWithFallback = loadImageWithFallback;

