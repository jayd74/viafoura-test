<script>
import GameTitle from '../components/GameTitle.vue';
import { useTrainerStore } from '../stores/trainer.js';

export default {
    components: {
        GameTitle
    },
    data() {
        return {
            isAnimating: false,
            validationError: ''
        }
    },
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
    },
    computed: {
        trainerName: {
            get() {
                return this.trainerStore.name;
            },
            async set(value) {
                this.trainerStore.setTrainerName(value);
                // Try to load progress for this trainer name
                if (value.trim()) {
                    await this.trainerStore.loadProgress(value.trim());
                }
            }
        }
    },
    methods: {
        startGame() {
            // Validate input using store
            if (!this.trainerStore.hasName) {
                this.validationError = 'Please enter your trainer name';
                return;
            }
            
            // Clear any previous validation error
            this.validationError = '';
            
            // Start game in store
            this.trainerStore.startGame();
            
            // Start animation
            this.isAnimating = true;
            
            // Navigate after animation completes
            setTimeout(() => {
                this.$router.push('/capture');
            }, 1000); // 1 second animation duration
        }
    }
};
</script>

<template>
    <main class="main-container">
        <div class="pokeball-background">
            <img src="../assets/pokeball.png" alt="Pokeball" class="pokeball-image" />
            <GameTitle :isAnimating="isAnimating" size="4rem" />
    
            <form id="form-registration" class="form-container">
                <input 
                    type="text" 
                    name="trainer-name" 
                    id="trainer-name" 
                    class="trainer-input" 
                    placeholder="Enter your trainer name"
                    v-model="trainerName"
                    :class="{ 'error': validationError }"
                />
                
                <div v-if="validationError" class="error-message">{{ validationError }}</div>
    
                <button @click.prevent="startGame" class="start-button">Start</button>
            </form>
        </div>
    </main>
</template>

<style scoped>

* {
    font-family: 'Courier New', monospace;
}
.main-container {
    background: #3498db;
}

.pokeball-background {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
    position: relative;
}

/* Pokeball Image */
.pokeball-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(20deg);
    width: 500px;
    height: 500px;
    z-index: 1;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
}


.form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    position: relative;
    z-index: 4;
}

.trainer-input {
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
    border: 2px solid #3498db;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    min-width: 250px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    text-align: center;
}

.trainer-input:focus {
    border-color: #2980b9;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.trainer-input.error {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: -0.5rem;
    text-align: center;
    font-weight: bold;
}

.start-button {
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: bold;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.start-button:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.start-button:active {
    transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .pokeball-image {
        width: 400px;
        height: 400px;
    }
}
</style>
