document.addEventListener("DOMContentLoaded", () => {
    const cakeContainer = document.getElementById("cake-container");

    // 1. Adatok betöltése a JSON fájlból
    fetch('cakes.json')
        .then(response => response.json())
        .then(data => {
            displayCakes(data);
        })
        .catch(error => console.error("Hiba a sütik betöltésekor:", error));

    // 2. Kártyák legenerálása
    function displayCakes(cakes) {
        cakeContainer.innerHTML = ""; // Alaphelyzetbe állítás

        cakes.forEach(cake => {
            // Létrehozzuk a kártya elemet
            const card = document.createElement("div");
            card.className = "recipe-card";

            // Kártya belső szerkezete
            card.innerHTML = `
                <img src="${cake.image}" alt="${cake.name}" class="recipe-img">
                <div class="recipe-info">
                    <h3>${cake.name}</h3>
                    <p><i class="clock-icon">🕒</i> ${cake.prepTime}</p>
                    <button class="view-btn" onclick="viewRecipe(${cake.id})">Megnézem</button>
                </div>
            `;

            cakeContainer.appendChild(card);
        });
    }
});

// 3. Függvény a recept részleteihez való navigáláshoz
function viewRecipe(id) {
    // Átirányítás a displayRecipe.html-re az ID-val az URL-ben
    window.location.href = `displayRecipe.html?id=${id}&type=cake`;
}