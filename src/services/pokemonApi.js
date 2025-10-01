// Pokémon API service for fetching Pokémon data
const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';

// Pokémon IDs (1-1025)
const ALL_POKEMON_IDS = Array.from({ length: 1025 }, (_, i) => i + 1);

export class PokemonApiService {
    /**
     * Get a random Pokémon
     * @returns {Promise<Object>} Pokémon data
     */
    static async getRandomPokemon() {
        try {
            // Get random Pokémon ID from Gen 1
            const randomId = ALL_POKEMON_IDS[Math.floor(Math.random() * ALL_POKEMON_IDS.length)];
            
            // Fetch Pokémon data
            const response = await fetch(`${POKEMON_API_BASE}/pokemon/${randomId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const pokemonData = await response.json();
            
            // Fetch species data for additional info
            const speciesResponse = await fetch(pokemonData.species.url);
            const speciesData = await speciesResponse.json();
            
            return {
                ...pokemonData,
                species: {
                    name: speciesData.name,
                    url: speciesData.url,
                    color: speciesData.color?.name || 'unknown',
                    habitat: speciesData.habitat?.name || 'unknown',
                    generation: speciesData.generation?.name || 'generation-i'
                }
            };
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            throw new Error('Failed to fetch Pokémon data');
        }
    }
    
    /**
     * Get Pokémon by ID
     * @param {number} id - Pokémon ID
     * @returns {Promise<Object>} Pokémon data
     */
    static async getPokemonById(id) {
        try {
            const response = await fetch(`${POKEMON_API_BASE}/pokemon/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon by ID:', error);
            throw new Error('Failed to fetch Pokémon data');
        }
    }
    
    /**
     * Get Pokémon by name
     * @param {string} name - Pokémon name
     * @returns {Promise<Object>} Pokémon data
     */
    static async getPokemonByName(name) {
        try {
            const response = await fetch(`${POKEMON_API_BASE}/pokemon/${name.toLowerCase()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon by name:', error);
            throw new Error('Failed to fetch Pokémon data');
        }
    }
}
