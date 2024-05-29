const BASE_URL = `https://pokeapi.co/api/v2/pokemon/`;
const limitPokemonAmount = 20;
let offset = 0;


function init() {
    includeHTML();
    fetchPokemonFromAPI();
    document.getElementById('loadMorePokemon').addEventListener('click', fetchPokemonFromAPI);
}




async function showPokemonImage(pokemonURL) {

    let content = document.getElementById('content');

    // let pokemonID = document.getElementById('searchPokemon').value;

    let response = await fetch(pokemonURL);
    let responseToJSON = await response.json();
    console.log(responseToJSON);
    // console.log("Held Items:", responseToJSON.held_items);
    // responseToJSON.sprites.forEach(sprites => {
    //     console.log("Sprites:", sprites.back_default);
    // });
    // console.log("Sprites:", responseToJSON.sprites.front_default);
    let types = responseToJSON.types.map(typeInfo => `<div class="single-type">${typeInfo.type.name}</div>`).join('');  
    content.innerHTML += `<div class="pokemon-card">
                        <img src="${responseToJSON.sprites.other.home.front_default}">
                        <b>${responseToJSON.name.toUpperCase()}</b>
                        <div class="pokemon-types">${types}</div>
                        </div>
                        `;
}


async function fetchPokemonFromAPI() {
    let pokemonURL = `${BASE_URL}?limit=${limitPokemonAmount}&offset=${offset}`;
    let response = await fetch(pokemonURL);
    let responseToJSON = await response.json();
    console.log(responseToJSON);
    

    for (let index = 0; index < responseToJSON.results.length; index++) {

        const pokemonName = responseToJSON.results[index];
        console.log(pokemonName.name);
        showPokemonImage(pokemonName.url);
    }
    offset += limitPokemonAmount;
}


function filterPokemon() {
    let pokemonID = document.getElementById('searchPokemon').value;
    let pokemonURL = BASE_URL + pokemonID;
    let searchPokemon = document.getElementById('searchPokemon').value;
    searchPokemon = searchPokemon.toLowerCase();
    console.log(searchPokemon);
    console.log(pokemonURL);
}






































async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}










