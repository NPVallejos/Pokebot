const fetch = require('node-fetch');
const POKE_URL = 'https://pokeapi.co/api/v2/pokemon';
const SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species';

async function getPokemon(pokemon) {
	try {
		let response = await fetch(`${POKE_URL}/${pokemon}`);
		return await response.json();
	} catch (err) {
		// console.log(err);
		return null;
	}
}

async function getEvolutionChain(id) {
	let pokemon_species = await getPokemonSpecies(id);
	let responseEvoChain = await fetch(pokemon_species.evolution_chain.url);
	return await responseEvoChain.json();
}

async function getPokemonSpecies(id) {
	let response = await fetch(`${SPECIES_URL}/${id}`);
	return await response.json();
}

module.exports = { getPokemon, getEvolutionChain };
