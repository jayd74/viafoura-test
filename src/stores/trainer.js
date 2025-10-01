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
        caughtPokemon: [],
        consecutiveFailures: 0,
        animationState: null,
        throwOutcome: null // 'throwing', 'success', 'failure', 'run-away'
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
                this.addEvent(`${capitalizedName} broke free!`);
            }
        },
        
        async findPokemon() {
            try {
                // Set loading state to hide old pokemon
                this.throwOutcome = 'loading';
                this.animationState = null;
                
                // Import the API service dynamically to avoid circular dependencies
                const { PokemonApiService } = await import('../services/pokemonApi.js');
                
                const pokemon = await PokemonApiService.getRandomPokemon();
                this.currentEncounter = pokemon;
                
                // Clear loading state and set up new encounter
                this.throwOutcome = null;
                
                // Update game state
                this.gameState.canFind = false;
                this.gameState.canIgnore = true;
                this.gameState.canThrow = true;
                
                // Add encounter event
                this.addEncounterEvent(pokemon.name);
                
                return pokemon;
            } catch (error) {
                this.throwOutcome = null; // Clear loading state on error
                this.addEvent('Failed to find a Pokémon. Try again!');
                console.error('Error finding Pokémon:', error);
                throw error;
            }
        },
        
        ignorePokemon() {
            if (this.currentEncounter) {
                const capitalizedName = this.currentEncounter.name.charAt(0).toUpperCase() + this.currentEncounter.name.slice(1);
                this.addEvent(`${capitalizedName} wandered away...`);
                this.animationState = 'ignore';
                // Delay the end encounter to allow animation to play
                setTimeout(() => {
                    this.endEncounter();
                }, 800);
            }
        },
        
        throwPokeball() {
            if (this.currentEncounter) {
                const capitalizedName = this.currentEncounter.name.charAt(0).toUpperCase() + this.currentEncounter.name.slice(1);
                
                // Log throw attempt
                this.addEvent(`${this.displayName} throws ball at ${capitalizedName}`);
                
                // Set throwing state and disable buttons
                this.throwOutcome = 'throwing';
                this.gameState.canIgnore = false;
                this.gameState.canThrow = false;
                
                // 1 in 3 chance for failure (33.33% failure rate)
                const caught = Math.random() > 0.333;
                
                // Simulate throw animation delay
                setTimeout(() => {
                    if (caught) {
                        // Success
                        this.throwOutcome = 'success';
                        this.caughtPokemon.push({
                            ...this.currentEncounter,
                            caughtAt: new Date().toISOString()
                        });
                        this.addCaptureEvent(this.currentEncounter.name, true);
                        this.consecutiveFailures = 0;
                        
                        // Keep in caught state - don't end encounter
                        // Just enable Find button for next encounter
                        this.gameState.canFind = true;
                    } else {
                        // Failure
                        this.consecutiveFailures++;
                        this.addCaptureEvent(this.currentEncounter.name, false);
                        
                        // Check if this is the 2nd consecutive failure
                        if (this.consecutiveFailures >= 2) {
                            // Pokémon runs away
                            this.throwOutcome = 'run-away';
                            this.addEvent(`${capitalizedName} runs away in frustration!`);
                            this.animationState = 'run-away';
                            this.consecutiveFailures = 0;
                            
                            // End encounter after animation
                            setTimeout(() => {
                                this.endEncounter();
                            }, 2000);
                        } else {
                            // Just failed, stay on screen
                            this.throwOutcome = 'failure';
                            this.gameState.canIgnore = true;
                            this.gameState.canThrow = true;
                        }
                    }
                }, 1500); // Throw animation duration
            }
        },
        
        endEncounter() {
            this.currentEncounter = null;
            this.gameState.canFind = true;
            this.gameState.canIgnore = false;
            this.gameState.canThrow = false;
            this.consecutiveFailures = 0;
            this.animationState = null;
            this.throwOutcome = null;
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
            this.consecutiveFailures = 0;
            this.animationState = null;
            this.throwOutcome = null;
        }
    }
});
