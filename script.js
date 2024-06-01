const BASE_URL = `https://pokeapi.co/api/v2/pokemon/`;
const limitPokemonAmount = 20;
let offset = 0;
let pokemonList = [];
let currentPokemonIndex = 0;

function init() {
    includeHTML();
    fetchPokemonFromAPI();
    document.getElementById('loadMorePokemon').addEventListener('click', fetchPokemonFromAPI);
}

async function showPokemonCard(pokemonURL) {
    let content = document.getElementById('content');
    let generatedContent = await generateContentHTML(pokemonURL);
    content.innerHTML += generatedContent;
}

async function generateContentHTML(pokemonURL) {
    let response = await fetch(pokemonURL);
    let responseToJSON = await response.json();
    let types = responseToJSON.types.map(typeInfo => `<div class="single-type">${typeInfo.type.name}</div>`).join('');

    return `<div class="pokemon-card" onclick="fetchPokemonStats('${pokemonURL}')">
    <img src="${responseToJSON.sprites.other.home.front_default}">
    <b>${responseToJSON.name.toUpperCase()}</b>
    <div class="pokemon-types">${types}</div>
    </div>`;
}

async function fetchPokemonFromAPI() {
    let pokemonURL = `${BASE_URL}?limit=${limitPokemonAmount}&offset=${offset}`;
    let response = await fetch(pokemonURL);
    let pokemonData = await response.json();

    for (let index = 0; index < pokemonData.results.length; index++) {
        const pokemon = pokemonData.results[index];
        pokemonList.push(pokemon);
        showPokemonCard(pokemon.url);
        currentPokemonIndex = pokemonList.indexOf(pokemon[index]);
    }
    offset += limitPokemonAmount;
}

function filterPokemon() {
    let pokemonID = document.getElementById('searchPokemon').value;
    let pokemonURL = BASE_URL + pokemonID;
    let searchPokemon = document.getElementById('searchPokemon').value;
    searchPokemon = searchPokemon.toLowerCase();
    console.log(searchPokemon);

    for (let index = 0; index < pokemonList.length; index++) {
        let pokemonToShow = pokemonList[index];
        pokemonToShow = String(pokemonToShow);
        if (pokemonToShow.toLowerCase().includes(searchPokemon)) {
            console.log('TEST');
        }

    }
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

    statsContainer.innerHTML = generateStatsContainerHTML(pokemonData);

    document.getElementById('previousPokemon').addEventListener('click', showPreviousPokemon);
    document.getElementById('nextPokemon').addEventListener('click', showNextPokemon);
}

function generateStatsContainerHTML(pokemonData) {
    let types = pokemonData.types.map(typeInfo => `<div class="single-type" style="visibility: visible;">${typeInfo.type.name}</div>`).join('');
    let stats = pokemonData.stats.map(statInfo => {
        let progressBarWidth = (statInfo.base_stat / 100) * 100;
        return `<div class="stat-item">
                    <div class="stat-name">${statInfo.stat.name.toUpperCase()}</div>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${progressBarWidth}%; background-color: red"
                            aria-valuenow="${statInfo.base_stat}" aria-valuemin="0" aria-valuemax="100">${statInfo.base_stat}</div>
                    </div>
                </div>`;
    }).join('');

    return `<div class="stats-container" onclick="event.stopPropagation()">
                <h1 id="previousPokemon"><</h1>
                <div class="stats-container-content">
                <img src="${pokemonData.sprites.other.home.front_default}" alt="${pokemonData.name}">
                <b>${pokemonData.name.toUpperCase()}</b>
                <div class="pokemon-types">${types}</div>
                <div class="all-stats">${stats}</div>
            </div>
                <h1 id="nextPokemon">></h1>
            </div>`;
}

function showPreviousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        let previousPokemonURL = pokemonList[currentPokemonIndex].url;
        fetchPokemonStats(previousPokemonURL);
    }
}

function showNextPokemon() {
    if (currentPokemonIndex < pokemonList.length) {
        currentPokemonIndex++;
        let nextPokemonURL = pokemonList[currentPokemonIndex].url;
        fetchPokemonStats(nextPokemonURL);
    }
}


function closePokemonStats() {
    statsContainer.style.display = "none";
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