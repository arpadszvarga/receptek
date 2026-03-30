document.addEventListener("DOMContentLoaded", () => {
    // Csak akkor fut le, ha nincs keresés az URL-ben
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('search')) {
        loadBreads();
    }
});

function loadBreads() {
    const container = document.getElementById('bread-container');
    
    fetch('bread&salty.json')
        .then(response => {
            if (!response.ok) throw new Error("Nem található a bread&salty.json");
            return response.json();
        })
        .then(data => {
            displayBreads(data, container);
        })
        .catch(error => {
            console.error("Hiba a kenyerek betöltésekor:", error);
            container.innerHTML = "<p>Sajnos nem sikerült betölteni a recepteket.</p>";
        });
}

function displayBreads(recipes, container) {
    container.innerHTML = "";
    
    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>🕒 ${recipe.prepTime}</p>
                <button class="view-btn" onclick="viewRecipe(${recipe.id}, 'bread')">Megnézem</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Navigáció a részletekre
function viewRecipe(id, type) {
    window.location.href = `displayRecipe.html?id=${id}&type=${type}`;
}