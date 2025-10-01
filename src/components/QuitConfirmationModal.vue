<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="quit-modal" @click.stop>
            <div class="modal-header">
                <h2>Quit Game?</h2>
            </div>
            
            <div class="modal-content">
                <p>Are you sure you want to quit? Your progress will be saved.</p>
                <div class="modal-buttons">
                    <button class="btn-yes" @click="confirmQuit">Yes</button>
                    <button class="btn-no" @click="closeModal">No</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useTrainerStore } from '../stores/trainer.js';

export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        
        confirmQuit() {
            // Save progress to local storage
            this.trainerStore.saveProgress();
            
            // Clear event log for fresh session
            this.trainerStore.clearEventLog();
            
            // Navigate to home screen
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-family: 'Courier New', monospace;
}

.quit-modal {
    background: white;
    border: 3px solid black;
    border-radius: 8px;
    padding: 0;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
    background: black;
    color: white;
    padding: 15px 20px;
    border-radius: 4px 4px 0 0;
    text-align: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
}

.modal-content {
    padding: 25px 20px;
    text-align: center;
}

.modal-content p {
    margin: 0 0 25px 0;
    font-size: 16px;
    color: black;
    line-height: 1.4;
}

.modal-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.modal-buttons button {
    background: white;
    color: black;
    border: 2px solid black;
    border-radius: 4px;
    padding: 10px 20px;
    font-family: 'Courier New', monospace;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 80px;
}

.modal-buttons button:hover {
    transform: translateX(3px);
    box-shadow: 3px 3px 0 black;
}

.modal-buttons button:active {
    transform: translateX(1px) translateY(1px);
    box-shadow: 1px 1px 0 black;
}

.btn-yes {
    background: black !important;
    color: white !important;
}

.btn-yes:hover {
    background: #333 !important;
}

.btn-no:hover {
    background: #f0f0f0;
}

/* Responsive adjustments */
@media (max-width: 480px) {
    .quit-modal {
        width: 95%;
        margin: 20px;
    }
    
    .modal-buttons {
        flex-direction: column;
        gap: 10px;
    }
    
    .modal-buttons button {
        width: 100%;
    }
}
</style>
