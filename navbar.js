document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        // 1. Betöltjük a külső HTML fájlt
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                
                // 2. Aktiváljuk a funkciókat a betöltés után
                setupHamburger();
                setupSearch();
                handleSearchPosition();
                checkUrlForSearch(); // Ellenőrzi, hogy érkezett-e keresőszó az URL-ben
            })
            .catch(error => console.error("Hiba a navbar betöltésekor:", error));
    }
});

// SZENDVICSGOMB KEZELÉSE
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle'); // Az X animációhoz
        });
    }
}

// KERESŐ MOZGATÁSA (Mobilon a menübe, asztalin a logó mellé)
function handleSearchPosition() {
    const searchBox = document.querySelector('.search-box');
    const navLinks = document.getElementById('nav-links');
    const navContainer = document.querySelector('.nav-container');

    if (!searchBox || !navLinks || !navContainer) return;

    const moveSearch = () => {
        if (window.innerWidth <= 1024) {
            if (!navLinks.contains(searchBox)) {
                navLinks.appendChild(searchBox);
            }
        } else {
            if (!navContainer.contains(searchBox)) {
                navContainer.appendChild(searchBox);
            }
        }
    };

    window.addEventListener('resize', moveSearch);
    moveSearch();
}

// KERESÉS LOGIKÁJA
function setupSearch() {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    if (searchBtn && searchInput) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (!query) return;

            // Megnézzük, a főoldalon vagyunk-e (GitHub Pages és lokális elérési út kezelése)
            const isIndex = window.location.pathname.endsWith("index.html") || 
                           window.location.pathname.endsWith("/") || 
                           window.location.pathname === "";

            if (isIndex && typeof globalSearch === "function") {
                // Főoldalon: sima keresés
                globalSearch(query);
                
                // Mobilon csukjuk be a menüt keresés után
                const navLinks = document.getElementById('nav-links');
                const hamburger = document.getElementById('hamburger');
                if (navLinks) navLinks.classList.remove('active');
                if (hamburger) hamburger.classList.remove('toggle');
            } else {
                // Másik oldalon: átirányítás az index.html-re a keresőszóval
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
        };

        searchBtn.addEventListener("click", performSearch);
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") performSearch();
        });
    }
}

// URL PARAMÉTER ELLENŐRZÉSE (Ha másik oldalról érkezünk)
function checkUrlForSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery && typeof globalSearch === "function") {
        // Adunk egy kis időt a searchengine.js-nek és a JSON betöltésnek
        setTimeout(() => {
            globalSearch(searchQuery);
            
            // Beírjuk a keresőbe is, hogy látszódjon, mire kerestünk
            const searchInput = document.getElementById("search-input");
            if (searchInput) searchInput.value = searchQuery;
        }, 500); 
    }
}