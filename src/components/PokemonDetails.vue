<template>
    <div class="pokemon-details" v-if="pokemon">
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
</template>

<script>
export default {
    name: 'PokemonDetails',
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
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+20:wght@400&display=swap');

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

/* Responsive design */
@media (max-width: 768px) {
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
