class api_meals {

    getData(url) {
        return fetch(url)
            .then(response => response.json())
            .then(result => result)
            .catch(error => console.log(error))
    }
}

export default api_meals;   