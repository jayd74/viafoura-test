<script>
import { useTrainerStore } from '../stores/trainer.js';
import PokedexModal from './PokedexModal.vue';

export default {
    components: {
        PokedexModal
    },
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
    },
    data() {
        return {
            showPokedexModal: false
        };
    },
    methods: {
        async findPokemon() {
            try {
                await this.trainerStore.findPokemon();
            } catch (error) {
                console.error('Error finding Pokémon:', error);
            }
        },
        
        ignorePokemon() {
            this.trainerStore.ignorePokemon();
        },
        
        throwPokeball() {
            this.trainerStore.throwPokeball();
        },
        
        showPokedex() {
            this.showPokedexModal = true;
        },
        
        closePokedex() {
            this.showPokedexModal = false;
        },
        
        quitGame() {
            this.$router.push('/');
        }
    }
};
</script>

<template>
    <form id="form-controls">
        <fieldset>
            <legend>Controls</legend>

            <button 
                name="btn-find" 
                @click.prevent="findPokemon"
                :disabled="!trainerStore.gameState.canFind"
            >
                Find
            </button>
            <button 
                name="btn-ignore" 
                @click.prevent="ignorePokemon"
                :disabled="!trainerStore.gameState.canIgnore"
            >
                Ignore
            </button>
            <button 
                name="btn-throw" 
                @click.prevent="throwPokeball"
                :disabled="!trainerStore.gameState.canThrow"
            >
                Throw
            </button>

            <button name="btn-collection" @click.prevent="showPokedex">
                Pokedex ({{ trainerStore.pokedexCount }})
            </button>

            <button name="btn-quit" @click.prevent="quitGame">Quit</button>
        </fieldset>
    </form>
    
    <!-- Pokedex Modal -->
    <PokedexModal 
        :is-open="showPokedexModal" 
        @close="closePokedex" 
    />
</template>

<style scoped>
#form-controls {
    background: white;
    border: 3px solid black;
    border-radius: 8px;
    padding: 20px;
    font-family: 'Courier New', monospace;
    margin: 0 auto;
}

fieldset {
    border: 2px solid black;
    border-radius: 4px;
    padding: 15px;
    margin: 0;
    background: white;
}

legend {
    font-weight: bold;
    color: black;
    padding: 0 10px;
    font-size: 16px;
}

button {
    background: white;
    color: black;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    margin: 5px;
    font-family: 'Courier New', monospace;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    min-width: 80px;
}

button:hover:not(:disabled) {
    transform: translateX(5px);
}

button:hover:not(:disabled)::before {
    content: '▶';
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    color: black;
    font-size: 18px;
    font-weight: bold;
}

button:disabled {
    background: #f0f0f0;
    color: #999;
    cursor: not-allowed;
    transform: none;
}

button:disabled::before {
    display: none;
}

button:active:not(:disabled) {
    transform: translateX(3px) translateY(1px);
    box-shadow: 2px 2px 0 black;
}

/* Grid layout for buttons */
#form-controls {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
}

fieldset {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
    align-items: center;
}

/* Responsive adjustments */
@media (max-width: 480px) {
    #form-controls {
        padding: 15px;
        margin: 10px;
    }
    
    fieldset {
        grid-template-columns: 1fr;
    }
    
    button {
        width: 100%;
        margin: 3px 0;
    }
}
</style>
