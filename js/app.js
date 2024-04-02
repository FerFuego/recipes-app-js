import UI from "./class/class-ui.js";
import Fav from "./class/class-favorites.js";
import api_meals from "./class/class-api.js";

export const ui = new UI();
export const api = new api_meals();
export const favorites = new Fav();

// init
document.addEventListener("DOMContentLoaded", () => {
    // get categories from api
    const categories = api.getData("https://www.themealdb.com/api/json/v1/1/categories.php"); 

    // categorias in select
    const select = document.querySelector("#categorias");
    if (select) {
        // set categories in select
        categories.then(data => {
            data.categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.strCategory;
                option.textContent = category.strCategory;
                select.appendChild(option);
            });
        });
    
        // get selected category
        select.addEventListener("change", (event) => {
            const category = event.target.value;
            const recipes = api.getData(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            // show recipes
            ui.showRecipes(recipes, category);
        });
    }

    // show favorites
    const Pagefavorites = document.querySelector("#favoritos");
    if (Pagefavorites) {
        ui.showFavorites(Pagefavorites);
    }

    // add to favorites
    const btnFavorite = document.querySelector("#btn-favorite");
    btnFavorite.addEventListener("click", (e) => {
        const id = e.target.dataset.mealId;
        const html = document.querySelector(`#receta-${id}`);
        const title = html.querySelector('.card-title').textContent;
        const image = html.querySelector('img').src;

        // check if exists
        if (favorites.exists(id)) {
            // remove from favorites
            favorites.remove(id);
            // show message
            ui.showMessage("Receta eliminada de Favoritos");
            // change button text
            e.target.textContent = "Guardar en Favoritos";
        } else {
            // add to favorites
            favorites.add({
                id: id, 
                title: title,
                image: image
            });
            // show message
            ui.showMessage("Receta agregada a Favoritos");
            // change button text
            e.target.textContent = "Quitar de Favoritos";
        }

    });

});