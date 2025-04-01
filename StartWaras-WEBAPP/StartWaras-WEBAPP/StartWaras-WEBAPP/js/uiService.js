function renderResults(items, type, container = "results") {
    const results = document.getElementById(container);
    results.innerHTML = "";
    
    if (!items || items.length === 0) {
        results.innerHTML = "<p class='no-results'>No se encontraron resultados</p>";
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("character-card");
        
        // Extract ID from URL
        const id = getIdFromUrl(item.url);
        const imageUrl = getImageUrl(type, id);
        const placeholderUrl = getPlaceholderUrl(type);

        // Verificar si el item está en favoritos
        const favorites = loadFromLocalStorage("favorites") || [];
        const isFavorite = favorites.some(fav => fav.id === id);

        let content = `
            <div class="image-container">
                <div class="image-wrapper">
                    <div class="image-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                </div>
                <div class="image-overlay">
                    <button onclick="event.stopPropagation(); addToFavorites('${item.name}', '${type}', '${id}')" 
                            class="favorite-btn ${isFavorite ? 'active' : ''}">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>`;
        
        if (type === "people") {
            content += `
                <div class="card-details">
                    <p><i class="fas fa-ruler-vertical"></i> Altura: ${item.height} cm</p>
                    <p><i class="fas fa-weight"></i> Peso: ${item.mass} kg</p>
                    <p><i class="fas fa-user"></i> Color de pelo: ${item.hair_color}</p>
                    <p><i class="fas fa-palette"></i> Color de piel: ${item.skin_color}</p>
                </div>`;
        } else if (type === "starships") {
            content += `
                <div class="card-details">
                    <p><i class="fas fa-space-shuttle"></i> Modelo: ${item.model}</p>
                    <p><i class="fas fa-industry"></i> Fabricante: ${item.manufacturer}</p>
                    <p><i class="fas fa-ship"></i> Clase: ${item.starship_class}</p>
                    <p><i class="fas fa-coins"></i> Coste: ${item.cost_in_credits} créditos</p>
                </div>`;
        }

        content += `</div>`;
        
        card.innerHTML = content;
        
        // Add click event for modal
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                showDetailsModal(item, type);
            }
        });

        // Manejar la carga de la imagen
        const imageWrapper = card.querySelector('.image-wrapper');
        const loadingSpinner = card.querySelector('.image-loading');
        
        loadImageWithFallback(
            imageUrl,
            placeholderUrl,
            (img) => {
                loadingSpinner.style.display = 'none';
                img.style.opacity = '1';
                imageWrapper.appendChild(img);
            },
            (img) => {
                loadingSpinner.style.display = 'none';
                img.style.opacity = '1';
                imageWrapper.appendChild(img);
            }
        );
        
        results.appendChild(card);
    });
}

function showDetailsModal(item, type) {
    const modal = document.getElementById("detailsModal");
    const modalContent = document.getElementById("modalContent");
    const id = getIdFromUrl(item.url);
    const imageUrl = getImageUrl(type, id);
    const placeholderUrl = getPlaceholderUrl(type);

    // Verificar si el item está en favoritos
    const favorites = loadFromLocalStorage("favorites") || [];
    const isFavorite = favorites.some(fav => fav.id === id);

    let content = `
        <div class="modal-header">
            <h2>${item.name}</h2>
            <button onclick="event.stopPropagation(); addToFavorites('${item.name}', '${type}', '${id}')" 
                    class="favorite-btn ${isFavorite ? 'active' : ''}">
                <i class="fas fa-star"></i>
            </button>
        </div>
        <div class="modal-image-container">
            <div class="image-wrapper">
                <div class="image-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </div>
        </div>
        <div class="modal-details">`;

    if (type === "people") {
        content += `
            <div class="detail-group">
                <h3><i class="fas fa-user"></i> Características Físicas</h3>
                <p><i class="fas fa-ruler-vertical"></i> <strong>Altura:</strong> ${item.height} cm</p>
                <p><i class="fas fa-weight"></i> <strong>Peso:</strong> ${item.mass} kg</p>
                <p><i class="fas fa-user"></i> <strong>Color de pelo:</strong> ${item.hair_color}</p>
                <p><i class="fas fa-palette"></i> <strong>Color de piel:</strong> ${item.skin_color}</p>
            </div>
            <div class="detail-group">
                <h3><i class="fas fa-info-circle"></i> Información Adicional</h3>
                <p><i class="fas fa-eye"></i> <strong>Color de ojos:</strong> ${item.eye_color}</p>
                <p><i class="fas fa-calendar"></i> <strong>Año de nacimiento:</strong> ${item.birth_year}</p>
                <p><i class="fas fa-venus-mars"></i> <strong>Género:</strong> ${item.gender}</p>
            </div>`;
    } else if (type === "starships") {
        content += `
            <div class="detail-group">
                <h3><i class="fas fa-ship"></i> Características Técnicas</h3>
                <p><i class="fas fa-space-shuttle"></i> <strong>Modelo:</strong> ${item.model}</p>
                <p><i class="fas fa-industry"></i> <strong>Fabricante:</strong> ${item.manufacturer}</p>
                <p><i class="fas fa-ship"></i> <strong>Clase:</strong> ${item.starship_class}</p>
                <p><i class="fas fa-coins"></i> <strong>Coste:</strong> ${item.cost_in_credits} créditos</p>
            </div>
            <div class="detail-group">
                <h3><i class="fas fa-info-circle"></i> Especificaciones</h3>
                <p><i class="fas fa-ruler"></i> <strong>Longitud:</strong> ${item.length} metros</p>
                <p><i class="fas fa-users"></i> <strong>Tripulación:</strong> ${item.crew}</p>
                <p><i class="fas fa-user-friends"></i> <strong>Pasajeros:</strong> ${item.passengers}</p>
            </div>`;
    }

    content += `</div>`;
    modalContent.innerHTML = content;
    modal.classList.remove("hidden");

    // Manejar la carga de la imagen en el modal
    const modalImageWrapper = modalContent.querySelector('.image-wrapper');
    const modalLoadingSpinner = modalContent.querySelector('.image-loading');
    
    loadImageWithFallback(
        imageUrl,
        placeholderUrl,
        (img) => {
            modalLoadingSpinner.style.display = 'none';
            img.style.opacity = '1';
            modalImageWrapper.appendChild(img);
        },
        (img) => {
            modalLoadingSpinner.style.display = 'none';
            img.style.opacity = '1';
            modalImageWrapper.appendChild(img);
        }
    );
}

function updatePagination(total, currentPage, onPageChange) {
    const pagination = document.getElementById("pagination");
    const pageInfo = document.getElementById("pageInfo");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    
    const totalPages = Math.ceil(total / 10);
    
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    
    pagination.classList.remove("hidden");
    
    prevButton.onclick = () => onPageChange(currentPage - 1);
    nextButton.onclick = () => onPageChange(currentPage + 1);
}

// Exponer funciones globalmente
window.showDetailsModal = showDetailsModal;
window.updatePagination = updatePagination;
