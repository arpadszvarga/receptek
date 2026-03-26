async function globalSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return;

    // 1. Betöltjük az összes adatot a háttérben, hogy eldöntsük, mi ez
    try {
        const [cakes, food] = await Promise.all([
            fetch('cakes.json').then(res => res.json()),
            fetch('food.json').then(res => res.json())
        ]);

        // Megkeressük az első találatot, hogy tudjuk, hová irányítsunk
        const firstCakeMatch = cakes.find(c => 
            c.name.toLowerCase().includes(searchTerm) || 
            c.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
        );

        const firstFoodMatch = food.find(f => 
            f.name.toLowerCase().includes(searchTerm) || 
            f.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
        );

        // 2. Navigációs döntés
        // Megnézzük, melyik oldalon vagyunk most
        const onCakesPage = document.getElementById('cake-container') !== null;
        const onFoodPage = document.getElementById('food-container') !== null;

        if (firstCakeMatch && !onCakesPage) {
            // Ha van süti találat és nem a süti oldalon vagyunk -> irány a cakes.html
            window.location.href = `cakes.html?search=${encodeURIComponent(searchTerm)}`;
        } 
        else if (firstFoodMatch && !onFoodPage) {
            // Ha van étel találat és nem az étel oldalon vagyunk -> irány a food.html
            window.location.href = `food.html?search=${encodeURIComponent(searchTerm)}`;
        } 
        else {
            // Ha már a megfelelő oldalon vagyunk, vagy nincs találat, csak futtassuk le helyben
            const container = document.getElementById('cake-container') || document.getElementById('food-container');
            if (container) {
                performSearch(searchTerm, container);
            } else {
                // Ha pl. a menüben vagyunk és nincs találat, alapértelmezetten a cakes.html-re küldjük "nincs találat" üzenetért
                window.location.href = `cakes.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    } catch (error) {
        console.error("Hiba a keresési navigáció közben:", error);
    }
}

// A performSearch és renderResults függvények maradhatnak az előző verzióból, 
// de itt egy biztos pont, hogy meglegyen minden:

function performSearch(searchTerm, container) {
    Promise.all([
        fetch('cakes.json').then(res => res.json()),
        fetch('food.json').then(res => res.json())
    ]).then(([cakes, food]) => {
        const allRecipes = [
            ...cakes.map(item => ({ ...item, type: 'cake' })),
            ...food.map(item => ({ ...item, type: 'food' }))
        ];

        const results = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) || 
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
        );

        renderResults(results, searchTerm, container);
    });
}

function renderResults(results, term, container) {
    const title = document.querySelector('h1');
    if (title) title.innerText = `Találatok: "${term}"`;

    container.innerHTML = "";
    if (results.length === 0) {
        container.innerHTML = `<p>Sajnos nincs találat a következőre: "${term}"</p>`;
        return;
    }

    results.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>🕒 ${recipe.prepTime}</p>
                <button class="view-btn" onclick="viewRecipe(${recipe.id}, '${recipe.type}')">Megnézem</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Inicializálás betöltéskor (hogy az URL paraméter alapján keressen)
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchWord = urlParams.get('search');
    const container = document.getElementById('cake-container') || document.getElementById('food-container');

    if (searchWord && container) {
        performSearch(searchWord, container);
    }
});