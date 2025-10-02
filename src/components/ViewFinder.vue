<template>
    <div class="viewfinder">
        <!-- Pokemon name section in top right -->
        <div v-if="trainerStore.hasActiveEncounter && trainerStore.throwOutcome !== 'success' && trainerStore.throwOutcome !== 'loading'" class="pokemon-name-section">
            <div class="pokemon-id">#{{ trainerStore.currentEncounter.id.toString().padStart(3, '0') }}</div>
            <h3 class="pokemon-name">{{ formatPokemonName(trainerStore.currentEncounter.name) }}</h3>
        </div>
        
        <div v-if="trainerStore.hasActiveEncounter" class="pokemon-encounter" :class="trainerStore.animationState">
            <!-- Show Pokémon only when not caught and not loading -->
            <div v-if="trainerStore.throwOutcome !== 'success' && trainerStore.throwOutcome !== 'loading'">
                <img 
                    :src="trainerStore.currentEncounter.sprites.front_default" 
                    :alt="trainerStore.currentEncounter.name"
                    class="pokemon-image"
                />
            </div>
            
            <!-- Loading state - show only background -->
            <div v-if="trainerStore.throwOutcome === 'loading'" class="loading-container">
            </div>
            
            <!-- Pokeball throwing animation -->
            <div v-if="trainerStore.throwOutcome === 'throwing'" class="pokeball-throw">
                <img src="../assets/pokeball.png" alt="Pokeball" class="pokeball" />
            </div>
            
            <!-- Success outcome -->
            <div v-if="trainerStore.throwOutcome === 'success'" class="success-outcome">
                <img src="../assets/pokeball.png" alt="Pokeball" class="pokeball-caught" />
            </div>
            
            <!-- Failure outcome -->
            <div v-if="trainerStore.throwOutcome === 'failure'" class="outcome-display failure">
                <div class="failure-message">
                    {{ formatPokemonName(trainerStore.currentEncounter.name) }} broke free!
                </div>
            </div>
            
            <!-- Run away outcome -->
            <div v-if="trainerStore.throwOutcome === 'run-away'" class="outcome-display run-away">
                <div class="run-away-message">
                    {{ formatPokemonName(trainerStore.currentEncounter.name) }} ran away!
                </div>
            </div>
        </div>
        <!-- Event Caption -->
        <div v-if="trainerStore.recentEvents.length > 0" class="event-caption">
            <div class="event-message">{{ trainerStore.recentEvents[trainerStore.recentEvents.length - 1].message }}</div>
        </div>
        
        <!-- No encounter message as event caption -->
        <div v-else-if="!trainerStore.hasActiveEncounter" class="event-caption">
            <div class="event-message">No Pokémon encountered yet. Click "Find" to search for a wild Pokémon!</div>
        </div>
    </div>
</template>

<script>
import { useTrainerStore } from '../stores/trainer.js';

export default {
    name: 'ViewFinder',
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

.viewfinder {
    background-image: url('../assets/background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 3px solid #3b4cca;
    border-radius: 12px;
    padding: 2rem;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    font-family: 'Courier New', monospace;
    position: relative;
    overflow: hidden;
}

.pokemon-encounter {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    width: 100%;
    height: 100%;
}

.pokemon-encounter.run-away {
    animation: runAway 1s ease-out forwards;
}

.pokemon-encounter.ignore {
    animation: fadeOut 0.8s ease-out forwards;
}


.pokemon-image {
    width: 200px;
    height: 200px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 5px rgba(59, 76, 202, 0.3);
    }
    50% {
        box-shadow: 0 0 15px rgba(59, 76, 202, 0.6);
    }
    100% {
        box-shadow: 0 0 5px rgba(59, 76, 202, 0.3);
    }
}

@keyframes pulseGlow {
    0% {
        box-shadow: 0 0 0 0 rgba(59, 76, 202, 0.7);
    }
    50% {
        box-shadow: 0 0 0 20px rgba(59, 76, 202, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(59, 76, 202, 0.7);
    }
}

@keyframes runAway {
    0% {
        transform: translateX(0) scale(1);
        opacity: 1;
    }
    50% {
        transform: translateX(-20px) scale(0.9);
        opacity: 0.7;
    }
    100% {
        transform: translateX(-100px) scale(0.5);
        opacity: 0;
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0.8);
    }
}

@keyframes throwPokeball {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    50% {
        transform: translateY(-150px) scale(1.2);
        opacity: 0.8;
    }
    100% {
        transform: translateY(-200px) scale(0.8);
        opacity: 0;
    }
}

@keyframes pokeballBounce {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    10% {
        transform: translateY(-15px) rotate(0deg);
    }
    20% {
        transform: translateY(0) rotate(0deg);
    }
    30% {
        transform: translateY(-12px) rotate(0deg);
    }
    40% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-10px) rotate(0deg);
    }
    60% {
        transform: translateY(0) rotate(0deg);
    }
    70% {
        transform: translateY(-8px) rotate(0deg);
    }
    80% {
        transform: translateY(0) rotate(0deg);
    }
    90% {
        transform: translateY(-5px) rotate(0deg);
    }
    100% {
        transform: translateY(0) rotate(20deg);
    }
}

.pokemon-name-section {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-align: center;
    background: #ffffff;
    border: 5px solid #000000;
    border-radius: 8px;
    padding: 0.5rem;
    color: #000000;
    min-width: 200px;
    z-index: 10;
}

.pokemon-name {
    margin: 0;
    color: #000000;
    font-size: 1.5rem;
    font-weight: bold;
}

.pokemon-id {
    color: #6c757d;
    font-size: 1.2rem;
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
    
    .pokemon-image,
    .pokeball-caught {
        padding: 1.5rem;
    }

}

/* Pokeball throwing animation */
.pokeball-throw {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}

.pokeball {
    width: 60px;
    height: 60px;
    animation: throwPokeball 1.5s ease-out forwards;
}

/* Outcome displays */
.outcome-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 15;
    text-align: center;
    background: rgba(0, 0, 0, 0.8);
    padding: 1rem 2rem;
    border-radius: 12px;
    border: 3px solid;
    animation: fadeIn 0.5s ease-in;
}

.outcome-display.success {
    border-color: #4ade80;
    color: #4ade80;
}

.outcome-display.failure {
    border-color: #f87171;
    color: #f87171;
}

.outcome-display.run-away {
    border-color: #fbbf24;
    color: #fbbf24;
}

/* Success outcome - pokeball replaces pokemon */
.success-outcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
}

.pokeball-caught {
    width: 200px;
    height: 200px;
    object-fit: contain;
    border-radius: 50%;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    animation: pokeballBounce 2.5s ease-out forwards;
    position: relative;
}

.pokeball-caught::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: transparent;
    animation: pulseGlow 2s infinite;
    pointer-events: none;
}

.success-message {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4ade80;
    text-shadow: 2px 2px 0 #3b4cca;
    text-align: center;
    background: rgba(0, 0, 0, 0.8);
    padding: 1rem 2rem;
    border-radius: 12px;
    border: 3px solid #4ade80;
    animation: fadeIn 0.5s ease-in;
}

.failure-message,
.run-away-message {
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

/* Loading state */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 300px;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(59, 76, 202, 0.3);
    border-top: 4px solid #3b4cca;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* Event Caption Styles */
.event-caption {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border: 3px solid black;
    border-radius: 8px;
    padding: 12px 20px;
    z-index: 10;
    font-family: 'Courier New', monospace;
    width: 80%;
    text-align: center;
    animation: fadeInSlide 0.5s ease-out;
}

.event-message {
    color: black;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
}

@keyframes fadeInSlide {
    0% {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

/* Responsive adjustments for event caption */
@media (max-width: 768px) {
    .event-caption {
        bottom: 10px;
        padding: 10px 16px;
        max-width: 90%;
    }
    
    .event-message {
        font-size: 12px;
    }
}
</style>
