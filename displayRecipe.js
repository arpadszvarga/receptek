document.addEventListener("DOMContentLoaded", () => {
    // 1. Paraméterek kinyerése az URL-ből (?id=1&type=cake)
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    const recipeType = urlParams.get('type'); // 'cake' vagy 'food'

    // 2. Megfelelő JSON fájl kiválasztása
    const jsonFile = recipeType === 'cake' ? 'cakes.json' : 'food.json';

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            const recipe = data.find(item => item.id === recipeId);
            if (recipe) {
                renderRecipe(recipe);
            } else {
                document.getElementById('recipe-title').innerText = "A recept nem található.";
            }
        })
        .catch(error => console.error("Hiba a recept betöltésekor:", error));
});

function renderRecipe(recipe) {
    document.getElementById('recipe-title').innerText = recipe.name;
    document.getElementById('recipe-image').src = recipe.image;
    document.getElementById('recipe-image').alt = recipe.name;
    document.getElementById('recipe-time').innerText = `🕒 Elkészítési idő: ${recipe.prepTime}`;

    // --- 1. HOZZÁVALÓK (Pöttyözött lista) ---
    const ingredientsUl = document.getElementById('ingredients-list');
    ingredientsUl.innerHTML = ''; 
    recipe.ingredients.forEach(ing => {
        if (ing.endsWith(':')) {
            // Alcím: Nem li, hanem egy div, így nincs előtte pötty
            const subTitle = document.createElement('div');
            subTitle.innerHTML = `<strong>${ing.replace(':', '')}</strong>`;
            subTitle.style.marginTop = "15px";
            subTitle.style.marginBottom = "5px";
            subTitle.style.fontSize = "1.1rem";
            subTitle.style.color = "#8da47e";
            ingredientsUl.appendChild(subTitle);
        } else {
            const li = document.createElement('li');
            li.innerText = ing;
            li.style.marginLeft = "20px"; // Hogy a pöttyök beljebb legyenek a címnél
            ingredientsUl.appendChild(li);
        }
    });

    // --- 2. ELKÉSZÍTÉS (Számozott lista) ---
    const instructionsOl = document.getElementById('instructions-list');
    instructionsOl.innerHTML = ''; 
    
    // Létrehozunk egy segéd-változót a számozáshoz
    let stepNumber = 1;

    recipe.instructions.forEach(step => {
        if (step.endsWith(':')) {
            // Alcím: Ez egy div lesz, NINCS SZÁMA és nem is növeli a számlálót
            const subTitle = document.createElement('div');
            subTitle.innerHTML = `<strong>${step.replace(':', '')}</strong>`;
            subTitle.style.marginTop = "25px";
            subTitle.style.marginBottom = "10px";
            subTitle.style.color = "#8da47e"; // Elegáns pirosas szín
            instructionsOl.appendChild(subTitle);
        } else {
            // Valódi lépés: Kézzel rakjuk oda a számot, így pontos lesz
            const stepDiv = document.createElement('div');
            stepDiv.style.marginBottom = "10px";
            stepDiv.style.paddingLeft = "5px";
            stepDiv.innerText = `${stepNumber}. ${step}`;
            instructionsOl.appendChild(stepDiv);
            
            stepNumber++; // Csak akkor növeljük a számot, ha valódi lépés volt!
        }
    });
}