<template>
    <div class="event-log">
        <div class="event-log-header">
            <h3>Event Log</h3>
        </div>
        <div class="event-list">
            <div 
                v-for="event in trainerStore.recentEvents" 
                :key="event.id" 
                class="event-item"
                :class="`event-${event.type}`"
            >
                <span class="event-timestamp">{{ event.timestamp }}</span>
                <span class="event-message">{{ event.message }}</span>
            </div>
            <div v-if="trainerStore.eventLog.length === 0" class="no-events">
                No events yet. Start your adventure!
            </div>
        </div>
    </div>
</template>

<script>
import { useTrainerStore } from '../stores/trainer.js';

export default {
    name: 'EventLog',
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
    }
}
</script>

<style scoped>

.event-log {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 2px solid #3b4cca;
    border-radius: 8px;
    padding: 1rem;
    color: #000000;
    font-family: 'Courier New', monospace;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #3b4cca;
}

.event-log-header h3 {
    margin: 0;
    color: #3b4cca;
    font-size: 1.2rem;
}

.event-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.event-item {
    display: flex;
    gap: 2rem;
    padding: 0.25rem 0;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.event-item:hover {
    background-color: rgba(59, 76, 202, 0.1);
}

.event-timestamp {
    color: #6c757d;
    font-size: 0.8rem;
    min-width: 60px;
    flex-shrink: 0;
}

.event-message {
    color: #000000;
    font-size: 0.9rem;
    flex: 1;
}

.event-info .event-message {
    color: #000000;
}

.event-success .event-message {
    color: #4ade80;
}

.event-error .event-message {
    color: #f87171;
}

.event-warning .event-message {
    color: #fbbf24;
}

.no-events {
    text-align: center;
    color: #6c757d;
    font-style: italic;
    padding: 1rem;
}

/* Scrollbar styling */
.event-log::-webkit-scrollbar {
    width: 6px;
}

.event-log::-webkit-scrollbar-track {
    background: rgba(59, 76, 202, 0.1);
    border-radius: 3px;
}

.event-log::-webkit-scrollbar-thumb {
    background: #3b4cca;
    border-radius: 3px;
}

.event-log::-webkit-scrollbar-thumb:hover {
    background: #2c3e50;
}
</style>
