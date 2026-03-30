// --- 1. GLOBÁLIS KERESÉS (Ez irányít az URL paraméterrel) ---
async function globalSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return;

    // Megkeressük a konténereket
    const cakeContainer = document.getElementById('cake-container');
    const foodContainer = document.getElementById('food-container');
    const breadContainer = document.getElementById('bread-container');
    
    // Bármelyik létezik, azt használjuk
    const container = cakeContainer || foodContainer || breadContainer;

    if (container) {
        // Ha megtaláltuk a helyet, elrejtjük a fő kategóriákat (ha a menüben vagyunk)
        const mainMenu = document.getElementById('main-menu-grid');
        if (mainMenu) mainMenu.style.display = 'none'; 

        performSearch(searchTerm, container);
    } else {
        // Ha egy olyan oldalon vagy (pl. index.html), ahol nincs rács:
        window.location.href = `cakes.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// --- 2. KERESÉS VÉGREHAJTÁSA (Ez tölt be és szűr) ---
function performSearch(searchTerm, container) {
    // Frissítjük a címet a keresett szóra
    const title = document.querySelector('h1');
    if (title) title.innerText = `Keresési találatok: "${searchTerm}"`;

    // Egyszerre töltjük be mindkét JSON-t
    Promise.all([
        fetch('cakes.json').then(res => res.json()),
        fetch('food.json').then(res => res.json()),
        fetch('bread&salty.json').then(res => res.json())
    ]).then(([cakes, food, breadSalty]) => {
        // Összefésüljük a kettőt egy nagy listába, megtartva a típust
        const allRecipes = [
            ...cakes.map(item => ({ ...item, type: 'cake' })),
            ...food.map(item => ({ ...item, type: 'food' })),
            ...breadSalty.map(item => ({ ...item, type: 'bread' }))
        ];

        // Szűrés név vagy hozzávalók alapján
        const results = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) || 
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
        );

        // Megjelenítés
        renderResults(results, container);
    }).catch(err => {
        console.error("Hiba az adatok betöltésekor:", err);
        container.innerHTML = "<p class='error'>Sajnos nem sikerült betölteni a recepteket.</p>";
    });
}

// --- 3. MEGJELENÍTÉS (Ez rajzolja ki a kártyákat EGYSÉGESEN) ---
function renderResults(results, container) {
    container.innerHTML = ""; // Kiürítjük az előző találatokat

    if (results.length === 0) {
        container.innerHTML = "<p class='no-results'>Sajnos nincs találat.</p>";
        return;
    }

    // Itt rajzoljuk ki a kártyákat
    results.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card"; // Használd azt a class-t, ami a CSS-edben a kártyát csinálja

        // Tiszta HTML: Csak a kép, név, idő és gomb, típus jelzése nélkül
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>🕒 ${recipe.prepTime}</p>
                <a href="displayRecipe.html?id=${recipe.id}&type=${recipe.type}" class="view-btn">Megnézem</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 4. INICIALIZÁLÁS (Betöltéskor ellenőrzi az URL-t) ---
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchWord = urlParams.get('search');
    const container = document.getElementById('cake-container') || document.getElementById('food-container') || document.getElementById('bread-container') ;

    if (searchWord && container) {
        // Ha az URL-ben van keresőszó és van hova kiírni, elindítjuk
        performSearch(searchWord, container);
    }
});

