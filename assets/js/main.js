const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="showPokemonDetails(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>
        </li>
    `
}

function showPokemonDetails(pokemonId) {
    // Buscar os dados do pokémon pelo ID
    pokeApi.getPokemonById(pokemonId).then((pokemon) => {
        pokemonDetailsCard.innerHTML = `
            <div class="pokemon-detail-view ${pokemon.type}">
                <div class="pokemon-detail-header">
                    <div>
                        <h2 class="pokemon-detail-name">${pokemon.name}</h2>
                        <span class="pokemon-detail-number">#${pokemon.number}</span>
                        <div class="pokemon-detail-types">
                            ${pokemon.types.map((type) => `<span class="type ${type}">${type}</span>`).join('')}
                        </div>
                    </div>
                    <img class="pokemon-detail-img" src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
                
                <div class="pokemon-detail-info">
                    <div class="pokemon-detail-section">
                        <h3>Physical</h3>
                        <div class="physical-traits">
                            <span>Height: ${pokemon.height/10}m</span> <br>
                            <span>Weight: ${pokemon.weight/10}kg</span>
                        </div>
                    </div>
                    
                    <div class="pokemon-detail-section">
                        <h3>Stats</h3>
                        <div class="pokemon-stats">
                            ${Object.entries(pokemon.status).map(([stat, value]) => `
                                <div class="pokemon-stat-item">
                                    <span class="pokemon-stat-name">${stat.replace('special-attack', 'Sp.Atk')
                                        .replace('special-defense', 'Sp.Def')
                                        .replace('-', ' ')}</span>
                                    <span class="pokemon-stat-value">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="pokemon-detail-section">
                        <h3>Abilities</h3>
                        <p>${pokemon.abilities.join(', ')}</p>
                    </div>
                    
                    <div class="pokemon-detail-section">
                        <h3>Moves</h3>
                        <p>${pokemon.moves.join(', ')}</p>
                    </div>
                </div>
            </div>
        `
    })
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})