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
        recentEvents: (state) => state.eventLog.slice(-10).reverse(), // Show last 10 events, newest first
        hasActiveEncounter: (state) => state.currentEncounter !== null,
        pokedexCount: (state) => {
            const uniquePokemon = new Set();
            state.caughtPokemon.forEach(pokemon => {
                uniquePokemon.add(pokemon.id);
            });
            return uniquePokemon.size;
        }
    },
    
    actions: {
        setTrainerName(name) {
            this.name = name;
            this.addEvent(`Trainer ${name} has joined the adventure!`);
        },
        
        startGame() {
            if (this.hasName) {
                this.isGameStarted = true;
                
                // Clear event log for fresh session
                this.clearEventLog();
                
                // Reset encounter state to ensure ViewFinder starts clean
                this.currentEncounter = null;
                this.gameState = {
                    canFind: true,
                    canIgnore: false,
                    canThrow: false
                };
                this.consecutiveFailures = 0;
                this.animationState = null;
                this.throwOutcome = null;
                
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
                            this.addEvent(`${capitalizedName} ran away!`);
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
        },
        
        saveProgress() {
            try {
                if (!this.name.trim()) {
                    this.addEvent('Cannot save progress without a trainer name');
                    return;
                }

                // Get existing trainers data
                const existingData = this.getAllTrainersData();
                
                // Update or add current trainer's data
                const trainerKey = this.name.trim().toLowerCase();
                existingData[trainerKey] = {
                    trainerName: this.name.trim(),
                    pokemonIds: this.caughtPokemon.map(pokemon => pokemon.id),
                    savedAt: new Date().toISOString()
                };
                
                localStorage.setItem('pokemon-trainers-progress', JSON.stringify(existingData));
                this.addEvent('Progress saved successfully!');
            } catch (error) {
                console.error('Error saving progress:', error);
                this.addEvent('Failed to save progress');
            }
        },
        
        async loadProgress(trainerName = null) {
            try {
                const nameToLoad = trainerName || this.name;
                if (!nameToLoad.trim()) {
                    // Clear Pokemon data if no name provided
                    this.caughtPokemon = [];
                    return false;
                }

                const allTrainersData = this.getAllTrainersData();
                const trainerKey = nameToLoad.trim().toLowerCase();
                const trainerData = allTrainersData[trainerKey];
                
                if (trainerData) {
                    this.name = trainerData.trainerName;
                    
                    // Load Pokemon IDs and fetch full data from API
                    if (trainerData.pokemonIds && trainerData.pokemonIds.length > 0) {
                        this.addEvent(`Loading ${trainerData.pokemonIds.length} Pokémon from your collection...`);
                        
                        // Fetch full Pokemon data for each ID
                        const pokemonPromises = trainerData.pokemonIds.map(async (id) => {
                            try {
                                const { PokemonApiService } = await import('../services/pokemonApi.js');
                                const pokemon = await PokemonApiService.getPokemonById(id);
                                return {
                                    ...pokemon,
                                    caughtAt: new Date().toISOString() // Add caught timestamp
                                };
                            } catch (error) {
                                console.error(`Error loading Pokemon ${id}:`, error);
                                return null;
                            }
                        });
                        
                        // Wait for all Pokemon to load
                        const pokemonResults = await Promise.all(pokemonPromises);
                        this.caughtPokemon = pokemonResults.filter(pokemon => pokemon !== null);
                        
                        this.addEvent(`Welcome back, ${this.displayName}! ${this.caughtPokemon.length} Pokémon loaded.`);
                    } else {
                        this.caughtPokemon = [];
                        this.addEvent(`Welcome back, ${this.displayName}! Starting fresh.`);
                    }
                    
                    return true;
                } else {
                    // No matching trainer found - clear Pokemon data
                    this.caughtPokemon = [];
                    this.addEvent(`Starting fresh adventure for ${nameToLoad}!`);
                    return false;
                }
            } catch (error) {
                console.error('Error loading progress:', error);
                this.addEvent('Failed to load saved progress');
                // Clear Pokemon data on error
                this.caughtPokemon = [];
            }
            return false;
        },
        
        getAllTrainersData() {
            try {
                const savedData = localStorage.getItem('pokemon-trainers-progress');
                return savedData ? JSON.parse(savedData) : {};
            } catch (error) {
                console.error('Error getting trainers data:', error);
                return {};
            }
        },
        
        getTrainerPokemonIds(trainerName) {
            try {
                const allTrainersData = this.getAllTrainersData();
                const trainerKey = trainerName.trim().toLowerCase();
                const trainerData = allTrainersData[trainerKey];
                return trainerData ? trainerData.pokemonIds || [] : [];
            } catch (error) {
                console.error('Error getting trainer Pokemon IDs:', error);
                return [];
            }
        },
        
        clearProgress(trainerName = null) {
            try {
                const nameToClear = trainerName || this.name;
                if (!nameToClear.trim()) {
                    this.addEvent('Cannot clear progress without a trainer name');
                    return;
                }

                const allTrainersData = this.getAllTrainersData();
                const trainerKey = nameToClear.trim().toLowerCase();
                
                if (allTrainersData[trainerKey]) {
                    delete allTrainersData[trainerKey];
                    localStorage.setItem('pokemon-trainers-progress', JSON.stringify(allTrainersData));
                    this.addEvent(`Progress cleared for ${nameToClear}`);
                } else {
                    this.addEvent(`No saved progress found for ${nameToClear}`);
                }
            } catch (error) {
                console.error('Error clearing progress:', error);
                this.addEvent('Failed to clear progress');
            }
        },
        
        clearEventLog() {
            this.eventLog = [];
        }
    }
});
