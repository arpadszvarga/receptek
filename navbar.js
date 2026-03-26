document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                setupSearch(); // Csak miután betöltődött a HTML, akkor állítjuk be a keresőt
            })
            .catch(error => console.error("Hiba a navbar betöltésekor:", error));
    }
});

function setupSearch() {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            const query = searchInput.value.trim();
            if (query) {
                // Meghívjuk a searchengine.js-ben lévő függvényt
                globalSearch(query);
            }
        });

        // Enter leütésre is keressen
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                globalSearch(searchInput.value.trim());
            }
        });
    }
}