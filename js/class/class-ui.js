import { api } from "./../app.js";
import { ui } from "./../app.js";
import { favorites } from "./../app.js";

class UI {

    showRecipes(recipes = [], category = "") {
        const body = document.querySelector("#resultado");
        body.innerHTML = "";

        recipes.then(data => {

            const heading = document.createElement("h2");
            heading.classList.add("text-center", "my-5");
            heading.textContent = data.meals.length ? `Resultados para "${category}"` : "No hay resultados para esta busqueda";
            body.appendChild(heading);

            data.meals.forEach(recipe => {
                const { idMeal, strMeal, strMealThumb } = recipe;

                const recetaContenedor = document.createElement('div');
                recetaContenedor.classList.add('col-md-4', 'mb-4');

                const recetaCard = document.createElement('div');
                recetaCard.classList.add('card');

                const recetaImagen = document.createElement('img');
                recetaImagen.classList.add('card-img-top');
                recetaImagen.alt = `Imagen de la receta ${strMeal}`;
                recetaImagen.src = strMealThumb;

                const recetaCardBody = document.createElement('div');
                recetaCardBody.classList.add('card-body');

                const recetaHeading = document.createElement('h5');
                recetaHeading.classList.add('card-title');
                recetaHeading.textContent = strMeal;

                const recetaCategory = document.createElement('p');
                recetaCategory.classList.add('card-text', 'text-muted');
                recetaCategory.textContent = `Categoría: ${category}`;

                const recetaButton = document.createElement('button');
                recetaButton.classList.add('btn', 'btn-danger', 'w-100');
                recetaButton.textContent = 'Ver Receta';
                recetaButton.dataset.bsTarget = "#modal";
                recetaButton.dataset.bsToggle = "modal";
                recetaButton.dataset.mealId = idMeal;
                recetaButton.onclick = function() {
                    ui.showRecipe(this.dataset.mealId);
                }

                // Inyectar en el código HTML
                recetaCardBody.appendChild(recetaHeading);
                recetaCardBody.appendChild(recetaCategory);
                recetaCardBody.appendChild(recetaButton);

                recetaCard.appendChild(recetaImagen);
                recetaCard.appendChild(recetaCardBody)

                recetaContenedor.appendChild(recetaCard);

                body.appendChild(recetaContenedor);
            });
        });

    }

    showRecipe(id) {
        const recipe = api.getData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

        recipe.then(data => {
            const recipe = data.meals[0];

            // crear el listado de ingredientes
            const list = document.createElement("ul");
            list.classList.add("list-group");

            // ingredientes y cantidades
            for(let i=1; i<=20; i++) {
                if(!recipe[`strIngredient${i}`]) break;
                const ingredient = document.createElement("li");
                ingredient.classList.add("list-group-item");
                ingredient.textContent = `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`;

                list.appendChild(ingredient);
            }

            // modal body
            const modalBody = document.querySelector("#modal .modal-body");
            modalBody.innerHTML = `
                <div class="row" id="receta-${recipe.idMeal}">
                    <div class="col-md-4">
                        <img class="card-img img-fluid" src="${recipe.strMealThumb}">
                        <h6 class="text-muted mt-3">Receta ${recipe.strArea}</h3>
                    </div>
                    <div class="col-md-8">
                        <h2 class="card-title mt-3">${recipe.strMeal}</h2>
                        <h4 class="mt-3">Instrucciones</h4>
                        <p>${recipe.strInstructions}</p>
                        <h4 class="mt-3">Ingredientes y Cantidad</h4>
                        ${list.outerHTML}
                    </div>
                </div>
            `;

            // set id to favorite button
            const btnFavorite = document.querySelector("#btn-favorite");
            btnFavorite.dataset.mealId = recipe.idMeal;
            btnFavorite.innerHTML = favorites.exists(recipe.idMeal) ? "Quitar de favoritos" : "Guardar en favoritos";
        });
    }

    showMessage (message) {
        const toastDiv = document.querySelector("#toast");
        const toastBody = document.querySelector(".toast-body");
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.innerHTML = message;
        toast.show();
    }

    showFavorites(element) {
        const favoritesrecipes = favorites.get();
        if (!favoritesrecipes.length) {
            const notFavorites = document.createElement("p");
            notFavorites.textContent = "No hay favoritos";
            element.appendChild(notFavorites);
            return;
        }

        favoritesrecipes.forEach(favorite => {
            const card = document.createElement("div");
            card.classList.add("col-md-4", "mb-4");
            card.innerHTML = `
                <div class="card">
                <img class="card-img-top" src="${favorite.image}">
                <div class="card-body">
                    <h5 class="card-title mb-3">${favorite.title}</h5>
                    <button class="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#modal" data-meal-id="${favorite.id}">Ver Receta</button>
                </div>
                </div>
            `;
            element.appendChild(card);
        });

        const btns = document.querySelectorAll(".btn");
        btns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                console.log(e.target.dataset.mealId);
                ui.showRecipe(e.target.dataset.mealId);
            });
        });
    }

}

export default UI;