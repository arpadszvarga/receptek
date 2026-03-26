document.addEventListener("DOMContentLoaded", () => {
    const foodContainer = document.getElementById("food-container");

    fetch('food.json')
        .then(response => {
            if (!response.ok) throw new Error("A food.json nem tölthető be!");
            return response.json();
        })
        .then(data => {
            displayFood(data);
        })
        .catch(error => console.error("Hiba:", error));

    function displayFood(foods) {
        foodContainer.innerHTML = "";

        foods.forEach(food => {
            const card = document.createElement("div");
            card.className = "recipe-card";

            card.innerHTML = `
                <img src="${food.image}" alt="${food.name}" class="recipe-img">
                <div class="recipe-info">
                    <h3>${food.name}</h3>
                    <p>🕒 ${food.prepTime}</p>
                    <button class="view-btn" onclick="viewRecipe(${food.id}, 'food')">Megnézem</button>
                </div>
            `;

            foodContainer.appendChild(card);
        });
    }
});

// Ez a függvény megegyezik a cakes.js-ben lévővel, 
// de jó ha itt is ott van a biztonság kedvéért
function viewRecipe(id, type) {
    window.location.href = `displayRecipe.html?id=${id}&type=${type}`;
}