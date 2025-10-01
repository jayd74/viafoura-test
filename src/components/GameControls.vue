<script>
import { useTrainerStore } from '../stores/trainer.js';

export default {
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
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
        
        showCollectionView() {
            this.$router.push('/collection');
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

            <button name="btn-collection" @click.prevent="showCollectionView">
                Pokedex ({{ trainerStore.pokedexCount }})
            </button>

            <button name="btn-quit" @click.prevent="quitGame">Quit</button>
        </fieldset>
    </form>
</template>
