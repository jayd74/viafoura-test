<template>
    <div class="encounter-stats" v-if="pokemon">
        <div class="pokemon-stats">
            <h4>Base Stats</h4>
            <div class="stats-grid">
                <div 
                    v-for="stat in pokemon.stats" 
                    :key="stat.stat.name"
                    class="stat-item"
                >
                    <span class="stat-name">{{ formatStatName(stat.stat.name) }}</span>
                    <div class="stat-bar">
                        <div 
                            class="stat-fill" 
                            :style="{ width: `${Math.min(100, (stat.base_stat / 150) * 100)}%` }"
                        ></div>
                    </div>
                    <span class="stat-value">{{ stat.base_stat }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EncounterStats',
    props: {
        pokemon: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatStatName(statName) {
            const statMap = {
                'hp': 'HP',
                'attack': 'ATK',
                'defense': 'DEF',
                'special-attack': 'SP.ATK',
                'special-defense': 'SP.DEF',
                'speed': 'SPD'
            };
            return statMap[statName] || statName.toUpperCase();
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+20:wght@400&display=swap');

.encounter-stats {
    background: #ffffff;
    border: 5px solid #3b4cca;
    border-radius: 8px;
    padding: 1.5rem;
    color: #000000;
    font-family: 'Jersey 20', monospace;
    width: 100%;
    max-width: 400px;
}


.pokemon-stats h4 {
    margin: 0 0 1rem 0;
    color:rgb(217, 189, 3);
    text-align: center;
    font-size: 1.2rem;
}

.stats-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.stat-name {
    color:rgb(217, 189, 3);
    font-weight: bold;
    min-width: 60px;
    font-size: 0.9rem;
}

.stat-bar {
    flex: 1;
    height: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
}

.stat-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
    border-radius: 6px;
    transition: width 0.3s ease;
}

.stat-value {
    color: #ffffff;
    font-weight: bold;
    min-width: 30px;
    text-align: right;
    font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .encounter-stats {
        padding: 1rem;
        max-width: 90%;
    }
    
    .pokemon-name {
        font-size: 1.3rem;
    }
    
    .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
    
    .label {
        min-width: auto;
    }
}
</style>
