<script>
import GameTitle from '../components/GameTitle.vue';

export default {
    components: {
        GameTitle
    },
    data() {
        return {
            trainerName: '',
            isAnimating: false,
            validationError: ''
        }
    },
    methods: {
        startGame() {
            // Validate input
            if (!this.trainerName.trim()) {
                this.validationError = 'Please enter your trainer name';
                return;
            }
            
            // Clear any previous validation error
            this.validationError = '';
            
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
            <div class="pokeball-line"></div>
            <GameTitle :isAnimating="isAnimating" />
    
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
@import url('https://fonts.googleapis.com/css2?family=Jersey+20:wght@400&display=swap');

* {
    font-family: 'Jersey 20', monospace;
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

/* Poké Ball Background */
.pokeball-background::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: linear-gradient(to bottom, #e74c3c 0%, #e74c3c 50%, #ffffff 50%, #ffffff 100%);
    border: 8px solid #2c3e50;
    box-shadow: 
        0 0 0 4px #34495e,
        0 10px 30px rgba(0, 0, 0, 0.3),
        inset 0 0 0 2px #2c3e50;
    z-index: 1;
}

/* Black line separating red and white halves */
.pokeball-line {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 8px;
    background: #2c3e50;
    z-index: 2;
    border-radius: 4px;
    mask: 
        linear-gradient(to right, 
            black 0%, 
            black calc(50% - 30px), 
            transparent calc(50% - 30px), 
            transparent calc(50% + 30px), 
            black calc(50% + 30px), 
            black 100%);
    -webkit-mask: 
        linear-gradient(to right, 
            black 0%, 
            black calc(50% - 30px), 
            transparent calc(50% - 30px), 
            transparent calc(50% + 30px), 
            black calc(50% + 30px), 
            black 100%);
}

/* Center Button */
.pokeball-background::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
    border: 6px solid #2c3e50;
    box-shadow: 
        0 0 0 3px #34495e,
        inset 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 3;
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
    .pokeball-background::before {
        width: 300px;
        height: 300px;
    }
    
    .pokeball-line {
        width: 300px;
        height: 6px;
        border-radius: 3px;
        mask: 
            linear-gradient(to right, 
                black 0%, 
                black calc(50% - 22.5px), 
                transparent calc(50% - 22.5px), 
                transparent calc(50% + 22.5px), 
                black calc(50% + 22.5px), 
                black 100%);
        -webkit-mask: 
            linear-gradient(to right, 
                black 0%, 
                black calc(50% - 22.5px), 
                transparent calc(50% - 22.5px), 
                transparent calc(50% + 22.5px), 
                black calc(50% + 22.5px), 
                black 100%);
    }
    
    .pokeball-background::after {
        width: 45px;
        height: 45px;
        border: 4px solid #2c3e50;
        box-shadow: 
            0 0 0 2px #34495e,
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
}
</style>
