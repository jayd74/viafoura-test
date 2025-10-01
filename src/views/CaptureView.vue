<template>
    <main class="capture-container">
        <GameTitle size="3rem" />
        <div class="capture-content">
            <p>Welcome to the Pokémon catching adventure, <span class="trainer-name">{{ trainerStore.displayName }}</span>!</p>
        </div>
        
        <div class="game-area">
            <div class="viewfinder-section">
                <ViewFinder />
            </div>
            
            <div class="controls-section">
                <GameControls />
            </div>
        </div>
        
        <div class="event-log-container">
            <EventLog />
        </div>
    </main>
</template>

<script>
import GameTitle from '../components/GameTitle.vue';
import EventLog from '../components/EventLog.vue';
import ViewFinder from '../components/ViewFinder.vue';
import GameControls from '../components/GameControls.vue';
import { useTrainerStore } from '../stores/trainer.js';

export default {
    components: {
        GameTitle,
        EventLog,
        ViewFinder,
        GameControls
    },
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+20:wght@400&display=swap');

* {
    font-family: 'Jersey 20', monospace;
}

.capture-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}


.capture-content {
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    text-align: center;
}

.capture-content p {
    font-size: 1.2rem;
    color: #2c3e50;
    margin: 0;
}

.trainer-name {
    font-size: 1.2rem;
    font-weight: 900;
    color: red;
}

.game-area {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    margin-top: 2rem;
}

.viewfinder-section {
    width: 100%;
}

.controls-section {
    width: 100%;
}

.event-log-container {
    margin-top: 2rem;
    width: 100%;
}

/* Responsive layout */
@media (min-width: 768px) {    
    .viewfinder-section {
        flex: 2;
    }
    
    .controls-section {
        flex: 1;
        min-width: 300px;
    }
}
</style>
