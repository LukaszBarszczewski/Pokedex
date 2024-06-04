const BASE_URL = `https://pokeapi.co/api/v2/pokemon/`;
const limitPokemonAmount = 20;
let offset = 0;
let pokemonList = [];
let currentPokemonIndex = 0;

const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

function init() {
    includeHTML();
    fetchPokemonFromAPI();
    document.getElementById('loadMorePokemon').addEventListener('click', fetchPokemonFromAPI);
}

async function showPokemonCard(pokemonURL, index) {
    let content = document.getElementById('content');
    let generatedContent = await generateContentHTML(pokemonURL, index);
    content.innerHTML += generatedContent;
}

async function generateContentHTML(pokemonURL, index) {
    let response = await fetch(pokemonURL);
    let responseToJSON = await response.json();
    let types = responseToJSON.types.map(typeInfo => {
        let typeName = typeInfo.type.name;
        let typeColor = typeColors[typeName] || '#777';
        return `<div class="single-type" style="background-color: ${typeColor};">${typeName}</div>`;
    }).join('');

    return `<div class="pokemon-card" onclick="fetchPokemonStats('${pokemonURL}', ${index})">
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

        await showPokemonCard(pokemon.url, pokemonList.length - 1);
    }
    offset += limitPokemonAmount;
}

function filterPokemon() {
    let searchPokemon = document.getElementById('searchPokemon').value.toLowerCase();
    let content = document.getElementById('content');
    content.innerHTML = ''; 

    let foundPokemon = false;

    for (let index = 0; index < pokemonList.length; index++) {
        let pokemonToShow = pokemonList[index].name;
        if (pokemonToShow.toLowerCase().includes(searchPokemon)) {
            showPokemonCard(pokemonList[index].url, index);
            foundPokemon = true;
        }
    }

    if (!foundPokemon) {
        content.innerHTML = '<h1>NO POKÉMON FOUND</h1>';
    }
}

async function fetchPokemonStats(pokemonURL, index) {
    currentPokemonIndex = index;
    let response = await fetch(pokemonURL);
    if (!response.ok) {
        console.error('Failed to fetch Pokémon stats:', response.statusText);
        return;
    }
    let pokemonData = await response.json();
    showPokemonStats(pokemonData);
}

async function showPokemonStats(pokemonData, index) {
    let statsContainer = document.getElementById('statsContainer');
    statsContainer.style.display = "flex";
    statsContainer.style.justifyContent = "center";
    statsContainer.style.alignItems = "center";

    statsContainer.innerHTML = generateStatsContainerHTML(pokemonData, index);

    document.getElementById('previousPokemon').addEventListener('click', showPreviousPokemon);
    document.getElementById('nextPokemon').addEventListener('click', showNextPokemon);
}

function generateStatsContainerHTML(pokemonData) {
    let types = pokemonData.types.map(typeInfo => {
        let typeName = typeInfo.type.name;
        let typeColor = typeColors[typeName] || '#777';
        return `<div class="single-type" style="background-color: ${typeColor}; visibility: visible;">${typeName}</div>`;
    }).join('');
    
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
        fetchPokemonStats(previousPokemonURL, currentPokemonIndex);
    }
}

function showNextPokemon() {
    if (currentPokemonIndex < pokemonList.length - 1) {
        currentPokemonIndex++;
        let nextPokemonURL = pokemonList[currentPokemonIndex].url;
        fetchPokemonStats(nextPokemonURL, currentPokemonIndex);
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