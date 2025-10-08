
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    //Novas Propriedades

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight

    pokemon.status = pokeDetail.stats.reduce((stats, stat) => {
        stats[stat.stat.name] = stat.base_stat
        return stats
    }, {})

    pokemon.abilities = pokeDetail.abilities
        .filter(ability => !ability.is_hidden) // //Pegando somente as "não-ocultas", pois são muitas.
        .map(ability => ability.ability.name)


    pokemon.moves = pokeDetail.moves
        .slice(0,4) // Somente os 4 primeiros movimentos.
        .map(move => move.move.name)

    return pokemon
}

// Novo método para buscar Pokémon por ID
pokeApi.getPokemonById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}


pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url) //Faz a requisição para a URL do Pokémon

        .then((response) => response.json()) //Converte a resposta em JSON → esse é o `pokeDetail`
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}


