<template>
    <div class="viewfinder">
        <div v-if="trainerStore.hasActiveEncounter" class="pokemon-encounter">
            <div class="pokemon-encounter-container">
                <div class="pokemon-image-container">
                    <img 
                        :src="trainerStore.currentEncounter.sprites.front_default" 
                        :alt="trainerStore.currentEncounter.name"
                        class="pokemon-image"
                    />
                </div>
                <div class="pokemon-name-section">
                    <h3 class="pokemon-name">{{ formatPokemonName(trainerStore.currentEncounter.name) }}</h3>
                    <div class="pokemon-id">#{{ trainerStore.currentEncounter.id.toString().padStart(3, '0') }}</div>
                </div>
            </div>
            <EncounterStats :pokemon="trainerStore.currentEncounter" />
        </div>
        <div v-else class="no-encounter">
            <p>No Pokémon encountered yet.</p>
            <p>Click "Find" to search for a wild Pokémon!</p>
        </div>
    </div>
</template>

<script>
import { useTrainerStore } from '../stores/trainer.js';
import EncounterStats from './EncounterStats.vue';

export default {
    name: 'ViewFinder',
    components: {
        EncounterStats
    },
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
    },
    methods: {
        formatPokemonName(name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+20:wght@400&display=swap');

.viewfinder {
    background: #ff0000;
    border: 3px solid #3b4cca;
    border-radius: 12px;
    padding: 2rem;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    font-family: 'Jersey 20', monospace;
}

.pokemon-encounter {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
}

.pokemon-encounter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
}

.pokemon-image-container {
    background: #ffffff;
    border-radius: 50%;
    padding: 2rem;
    border: 4px solid #ffde00;
    box-shadow: 0 0 20px rgba(255, 222, 0, 0.3);
    animation: pulse 2s infinite;
}

.pokemon-image {
    width: 200px;
    height: 200px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 20px rgba(59, 76, 202, 0.3);
    }
    50% {
        box-shadow: 0 0 30px rgba(59, 76, 202, 0.6);
    }
    100% {
        box-shadow: 0 0 20px rgba(59, 76, 202, 0.3);
    }
}

.pokemon-name-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    background: #ffffff;
    border: 5px solid #3b4cca;
    border-radius: 8px;
    padding: 0.5rem;
    color: #000000;
}

.pokemon-name {
    margin: 0 0 0.5rem 0;
    color: #3b4cca;
    font-size: 2rem;
    text-shadow: 2px 2px 0 #ffde00;
    font-weight: bold;
    margin: 0;
}

.pokemon-id {
    color: #6c757d;
    font-size: 1.2rem;
    font-weight: bold;
}

.no-encounter {
    text-align: center;
    color: #ffde00;
}

.no-encounter p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
}

.no-encounter p:first-child {
    font-size: 1.3rem;
    font-weight: bold;
}

/* Responsive design */
@media (max-width: 768px) {
    .viewfinder {
        padding: 1rem;
        min-height: 300px;
    }
    
    .pokemon-image {
        width: 150px;
        height: 150px;
    }
    
    .pokemon-image-container {
        padding: 1.5rem;
    }

    .pokemon-encounter {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
