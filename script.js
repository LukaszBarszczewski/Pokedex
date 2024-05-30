const BASE_URL = `https://pokeapi.co/api/v2/pokemon/`;
const limitPokemonAmount = 20;
let offset = 0;


function init() {
    includeHTML();
    fetchPokemonFromAPI();
    document.getElementById('loadMorePokemon').addEventListener('click', fetchPokemonFromAPI);
}




async function showPokemonCard(pokemonURL) {

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
    content.innerHTML += `<div class="pokemon-card" onclick="fetchPokemonStats('${pokemonURL}')">
                        <img src="${responseToJSON.sprites.other.home.front_default}">
                        <b>${responseToJSON.name.toUpperCase()}</b>
                        <div class="pokemon-types">${types}</div>
                        </div>
                        `;
}


async function fetchPokemonFromAPI() {
    let pokemonURL = `${BASE_URL}?limit=${limitPokemonAmount}&offset=${offset}`;
    let response = await fetch(pokemonURL);
    let pokemonData = await response.json();
    // console.log(responseToJSON);


    for (let index = 0; index < pokemonData.results.length; index++) {

        const pokemonName = pokemonData.results[index];
        // console.log(pokemonName.name);
        showPokemonCard(pokemonName.url);
    }
    offset += limitPokemonAmount;
}


function filterPokemon() {
    let pokemonID = document.getElementById('searchPokemon').value;
    let pokemonURL = BASE_URL + pokemonID;
    let searchPokemon = document.getElementById('searchPokemon').value;
    searchPokemon = searchPokemon.toLowerCase();
    // console.log(searchPokemon);
    // console.log(pokemonURL);
}


async function fetchPokemonStats(pokemonURL) {
    let response = await fetch(pokemonURL);
    let pokemonData = await response.json();

    console.log(`Stats for ${pokemonData.name}:`);
    pokemonData.stats.forEach(statInfo => {
        console.log(`${statInfo.stat.name}: ${statInfo.base_stat}`);
    });

    showPokemonStats(pokemonData);
}

async function showPokemonStats(pokemonData) {
    let statsContainer = document.getElementById('statsContainer');
    statsContainer.style.display = "flex";
    statsContainer.style.justifyContent = "center";
    statsContainer.style.alignItems = "center";

    let types = pokemonData.types.map(typeInfo => `<div class="single-type" style="visibility: visible;">${typeInfo.type.name}</div>`).join('');
    let stats = pokemonData.stats.map(statInfo => {
        // Berechne die Fortschrittsleiste für jede Statistik
        let progressBarWidth = (statInfo.base_stat / 100) * 100; // Annahme: 255 ist der maximale Wert für eine Statistik
        return `<div class="stat-item">
                    <div class="stat-name">${statInfo.stat.name}</div>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${progressBarWidth}%; background-color: red"
                            aria-valuenow="${statInfo.base_stat}" aria-valuemin="0" aria-valuemax="100">${statInfo.base_stat}</div>
                    </div>
                </div>`;
    }).join('');

    statsContainer.innerHTML = `<div class="stats-container">
                                    <img src="${pokemonData.sprites.other.home.front_default}" alt="${pokemonData.name}">
                                    <b>${pokemonData.name.toUpperCase()}</b>
                                    <div class="pokemon-types">${types}</div>
                                    <div class="all-stats">${stats}</div>
                                </div>`;
    console.log('Stats displayed');
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










