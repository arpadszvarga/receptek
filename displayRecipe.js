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

    // Hozzávalók listázása
    const ingredientsUl = document.getElementById('ingredients-list');
    recipe.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.innerText = ing;
        ingredientsUl.appendChild(li);
    });

    // Elkészítés lépései (Számozott lista)
    const instructionsOl = document.getElementById('instructions-list');
    recipe.instructions.forEach(step => {
        const li = document.createElement('li');
        li.innerText = step;
        instructionsOl.appendChild(li);
    });
}