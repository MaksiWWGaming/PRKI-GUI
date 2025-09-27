import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Pokemon API functions
export const pokemonAPI = {
  // Get list of pokemon with pagination
  async getPokemon(limit = 20, offset = 0) {
    try {
      const response = await api.get(
        `/pokemon?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch Pokemon list");
    }
  },

  // Get detailed pokemon data
  async getPokemonDetails(nameOrId) {
    try {
      const response = await api.get(`/pokemon/${nameOrId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Pokemon details for ${nameOrId}`);
    }
  },

  // Get pokemon with details (for display cards)
  async getPokemonWithDetails(limit = 20, offset = 0) {
    try {
      const listResponse = await this.getPokemon(limit, offset);
      const pokemonWithDetails = await Promise.all(
        listResponse.results.map(async (pokemon) => {
          const details = await this.getPokemonDetails(pokemon.name);
          return {
            id: details.id,
            name: details.name,
            image:
              details.sprites.front_default ||
              details.sprites.other["official-artwork"].front_default,
            types: details.types.map((type) => type.type.name),
            height: details.height,
            weight: details.weight,
            abilities: details.abilities.map((ability) => ability.ability.name),
          };
        })
      );
      return {
        ...listResponse,
        results: pokemonWithDetails,
      };
    } catch (error) {
      throw new Error("Failed to fetch Pokemon with details");
    }
  },

  // Search pokemon by name
  async searchPokemon(query) {
    try {
      // PokeAPI doesn't have a search endpoint, so we'll get a larger list and filter
      const response = await this.getPokemon(1000, 0);
      const filtered = response.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );

      // Get details for filtered results (limit to 20 for performance)
      const limitedResults = filtered.slice(0, 20);
      const pokemonWithDetails = await Promise.all(
        limitedResults.map(async (pokemon) => {
          const details = await this.getPokemonDetails(pokemon.name);
          return {
            id: details.id,
            name: details.name,
            image:
              details.sprites.front_default ||
              details.sprites.other["official-artwork"].front_default,
            types: details.types.map((type) => type.type.name),
            height: details.height,
            weight: details.weight,
            abilities: details.abilities.map((ability) => ability.ability.name),
          };
        })
      );

      return {
        count: filtered.length,
        results: pokemonWithDetails,
      };
    } catch (error) {
      throw new Error("Failed to search Pokemon");
    }
  },
};

export default api;