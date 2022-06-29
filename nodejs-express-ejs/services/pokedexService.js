const axios = require("axios").default;

const cache = {};

const getPokemon = async (id) => {
  return axios.get("https://pokeapi.co/api/v2/pokemon/" + encodeURI(id));
};

const transformPokemonResponse = ({ id, sprites, name }) => {
  const pokemon = { id, name };
  pokemon.sprites = {
    front: sprites.front_default,
    back: sprites.back_default,
  };
  return pokemon;
};

const searchPokemonByName = async (name) => {
  console.log("searchPokemonByName->", name);
  try {
    if (cache[name]) {
      console.log(name, "from cache");
      return cache[name];
    } else {
      const response = await getPokemon(name);
      console.log(response.request.path, response.status, response.statusText);
      const pkm = transformPokemonResponse(response.data);
      cache[name] = pkm;
      return pkm;
    }
  } catch (error) {
    console.error("Error", error.message);
    if (error.response && error.response.status === 404) {
      throw "I couldn't find this pokemon";
    }
    throw "Oops, something went wrong! Try again later.";
  }
};

const searchPokemonById = async (id) => {
  console.log("searchPokemonById->", id);
  try {
    if (cache[id]) {
      console.log(id, "from cache");
      return cache[id];
    } else {
      const response = await getPokemon(id);
      console.log(response.request.path, response.status, response.statusText);
      const pkm = transformPokemonResponse(response.data);
      cache[id] = pkm;
      return pkm;
    }
  } catch (error) {
    console.error("Error", error.message);
    if (error.response && error.response.status === 404) {
      throw "I couldn't find this pokemon";
    }
    throw "Oops, something went wrong! Try again later.";
  }
};

const getRandomPokemons = async (amount) => {
  console.log("getRandomPokemons->", amount);
  const maxPokemonId = 1000;
  const pokemonIds = Array.from({ length: amount }, () =>
    Math.floor(Math.random() * maxPokemonId)
  );

  try {
    const responses = await Promise.allSettled(pokemonIds.map(getPokemon));
    return responses
      .map((result) => {
        console.log(result.status);
        if (
          result.status === "fulfilled" &&
          result.value.status === 200 &&
          result.value.data
        ) {
          return transformPokemonResponse(result.value.data);
        }
        return null;
      })
      .filter((p) => p != null);
  } catch (error) {
    console.error("Error", error.message);
    throw "Oops, something went wrong! Try again later.";
  }
};

module.exports = { searchPokemonByName, searchPokemonById, getRandomPokemons };
