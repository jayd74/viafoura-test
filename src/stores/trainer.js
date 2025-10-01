import { defineStore } from 'pinia';

export const useTrainerStore = defineStore('trainer', {
    state: () => ({
        name: '',
        isGameStarted: false,
        eventLog: [],
        currentEncounter: null,
        gameState: {
            canFind: true,
            canIgnore: false,
            canThrow: false
        },
        caughtPokemon: []
    }),
    
    getters: {
        hasName: (state) => state.name.trim().length > 0,
        displayName: (state) => state.name.trim() || 'Trainer',
        recentEvents: (state) => state.eventLog.slice(-10), // Show last 10 events
        hasActiveEncounter: (state) => state.currentEncounter !== null,
        pokedexCount: (state) => state.caughtPokemon.length
    },
    
    actions: {
        setTrainerName(name) {
            this.name = name;
            this.addEvent(`Trainer ${name} has joined the adventure!`);
        },
        
        startGame() {
            if (this.hasName) {
                this.isGameStarted = true;
                this.addEvent(`${this.displayName} has started their Pokémon catching journey!`);
                return true;
            }
            return false;
        },
        
        addEvent(message) {
            const timestamp = new Date().toLocaleTimeString();
            this.eventLog.push({
                id: Date.now(),
                timestamp,
                message,
                type: 'info'
            });
        },
        
        addEncounterEvent(pokemonName) {
            const capitalizedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
            this.addEvent(`A wild ${capitalizedName} appeared!`);
        },
        
        addCaptureEvent(pokemonName, success) {
            const capitalizedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
            if (success) {
                this.addEvent(`${this.displayName} successfully caught ${capitalizedName}!`);
            } else {
                this.addEvent(`${capitalizedName} broke free and ran away!`);
            }
        },
        
        async findPokemon() {
            try {
                // Import the API service dynamically to avoid circular dependencies
                const { PokemonApiService } = await import('../services/pokemonApi.js');
                
                const pokemon = await PokemonApiService.getRandomPokemon();
                this.currentEncounter = pokemon;
                // Update game state
                this.gameState.canFind = false;
                this.gameState.canIgnore = true;
                this.gameState.canThrow = true;
                
                // Add encounter event
                this.addEncounterEvent(pokemon.name);
                
                return pokemon;
            } catch (error) {
                this.addEvent('Failed to find a Pokémon. Try again!');
                console.error('Error finding Pokémon:', error);
                throw error;
            }
        },
        
        ignorePokemon() {
            if (this.currentEncounter) {
                const capitalizedName = this.currentEncounter.name.charAt(0).toUpperCase() + this.currentEncounter.name.slice(1);
                this.addEvent(`${capitalizedName} wandered away...`);
                this.endEncounter();
            }
        },
        
        throwPokeball() {
            if (this.currentEncounter) {
                // Simple catch logic - 50% chance for now
                const caught = Math.random() < 0.5;
                
                if (caught) {
                    // Add to caught Pokémon
                    this.caughtPokemon.push({
                        ...this.currentEncounter,
                        caughtAt: new Date().toISOString()
                    });
                    this.addCaptureEvent(this.currentEncounter.name, true);
                } else {
                    this.addCaptureEvent(this.currentEncounter.name, false);
                }
                
                this.endEncounter();
            }
        },
        
        endEncounter() {
            this.currentEncounter = null;
            this.gameState.canFind = true;
            this.gameState.canIgnore = false;
            this.gameState.canThrow = false;
        },
        
        resetGame() {
            this.name = '';
            this.isGameStarted = false;
            this.eventLog = [];
            this.currentEncounter = null;
            this.gameState = {
                canFind: true,
                canIgnore: false,
                canThrow: false
            };
            this.caughtPokemon = [];
        }
    }
});
