const express = require("express");
const router = express.Router();
const {
  getRandomPokemons,
  searchPokemonByName,
  searchPokemonById,
} = require("../services/pokedexService");

/* GET home page. */
router.get("/", async function (req, res, next) {
  //Fetch a few pokemons, maybe 10 or 20
  getRandomPokemons(10)
    .then((pkms) => res.render("index", { data: { pokemons: pkms } }))
    .catch((err) => res.render("index", { data: { error: err } }));
});

/*
curl "http://localhost:3000/pokemon/101"
 */
router.get("/pokemon/:id", async function (req, res, next) {
  const pokemonId = req.params.id;
  searchPokemonById(pokemonId)
    .then((pkm) =>
      res.render("single-pokemon", { data: { title: pkm.name, pokemon: pkm } })
    )
    .catch((err) => res.render("single-pokemon", { data: { error: err } }));
});

/*
curl "http://localhost:3000/search?source=navBar" ^ -H "Content-Type: application/x-www-form-urlencoded" --data-raw "pokemonSearch=pikachu"
 */
router.post("/search", async (req, res, next) => {
  const pokemonName = req.body.pokemonSearch;
  searchPokemonByName(pokemonName)
    .then((pkm) =>
      res.render("single-pokemon", { data: { title: pkm.name, pokemon: pkm } })
    )
    .catch((err) => res.render("single-pokemon", { data: { error: err } }));
});

module.exports = router;
