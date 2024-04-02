class favorites {

    get() {
        return JSON.parse(localStorage.getItem("favorites")) ?? [];
    }

    add(receta) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];
        //favorites.push(receta);
        //localStorage.setItem("favorites", JSON.stringify(favorites));
        localStorage.setItem("favorites", JSON.stringify([...favorites, receta]));
    }

    exists(id) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];
        return favorites.some(favorite => favorite.id === id);
    }

    remove(id) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];
        const newFavorites = favorites.filter(favorite => favorite.id !== id);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }


}

export default favorites;