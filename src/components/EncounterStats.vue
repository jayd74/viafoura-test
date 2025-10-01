<template>
    <div class="encounter-stats" v-if="pokemon">
        <div class="pokemon-details">
            <div class="detail-row">
                <span class="label">Type:</span>
                <div class="types">
                    <span 
                        v-for="type in pokemon.types" 
                        :key="type.slot"
                        class="type-badge"
                        :class="`type-${type.type.name}`"
                    >
                        {{ formatTypeName(type.type.name) }}
                    </span>
                </div>
            </div>
            
            <div class="detail-row">
                <span class="label">Height:</span>
                <span class="value">{{ formatHeight(pokemon.height) }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Weight:</span>
                <span class="value">{{ formatWeight(pokemon.weight) }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Base Experience:</span>
                <span class="value">{{ pokemon.baseExperience }}</span>
            </div>
        </div>
        
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
        formatTypeName(type) {
            return type.charAt(0).toUpperCase() + type.slice(1);
        },
        
        formatHeight(height) {
            // Height is in decimeters, convert to feet and inches
            const totalInches = height * 3.937;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            return `${feet}'${inches}"`;
        },
        
        formatWeight(weight) {
            // Weight is in hectograms, convert to pounds
            const pounds = (weight * 0.220462).toFixed(1);
            return `${pounds} lbs`;
        },
        
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

.pokemon-details {
    margin-bottom: 1.5rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.label {
    color: #000000;
    font-weight: bold;
    min-width: 120px;
}

.value {
    color: #000000;
}

.types {
    display: flex;
    gap: 0.5rem;
}

.type-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    color: #ffffff;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

/* Type colors */
.type-normal { background-color: #a8a878; }
.type-fire { background-color: #f08030; }
.type-water { background-color: #6890f0; }
.type-electric { background-color: #f8d030; }
.type-grass { background-color: #78c850; }
.type-ice { background-color: #98d8d8; }
.type-fighting { background-color: #c03028; }
.type-poison { background-color: #a040a0; }
.type-ground { background-color: #e0c068; }
.type-flying { background-color: #a890f0; }
.type-psychic { background-color: #f85888; }
.type-bug { background-color: #a8b820; }
.type-rock { background-color: #b8a038; }
.type-ghost { background-color: #705898; }
.type-dragon { background-color: #7038f8; }
.type-dark { background-color: #705848; }
.type-steel { background-color: #b8b8d0; }
.type-fairy { background-color: #ee99ac; }

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
