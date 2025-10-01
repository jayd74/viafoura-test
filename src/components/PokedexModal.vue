<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="pokedex-modal" @click.stop>
            <!-- Header -->
            <div class="pokedex-header">
                <h2>Pokédex</h2>
            </div>
            
            <!-- Controls Section -->
            <div class="controls-section">
                <div class="sort-controls">
                    <label>Sort by:</label>
                    <div class="dropdown-container">
                        <button 
                            class="dropdown-button" 
                            @click="toggleSortDropdown"
                            :class="{ 'active': isSortDropdownOpen }"
                        >
                            {{ getSortDisplayName(sortBy) }}
                            <span class="dropdown-arrow">{{ isSortDropdownOpen ? '▲' : '▼' }}</span>
                        </button>
                        <div v-if="isSortDropdownOpen" class="sort-dropdown">
                            <div class="sort-options">
                                <button 
                                    v-for="option in sortOptions" 
                                    :key="option.value"
                                    class="sort-option"
                                    :class="{ 'selected': sortBy === option.value }"
                                    @click="selectSortOption(option.value)"
                                >
                                    {{ option.label }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="availableTypes.length > 0" class="filter-controls">
                    <label>Filter by type:</label>
                    <div class="dropdown-container">
                        <button 
                            class="dropdown-button" 
                            @click="toggleTypeDropdown"
                            :class="{ 'active': isTypeDropdownOpen }"
                        >
                            {{ selectedTypes.length > 0 ? `${selectedTypes.length} selected` : 'All types' }}
                            <span class="dropdown-arrow">{{ isTypeDropdownOpen ? '▲' : '▼' }}</span>
                        </button>
                        <div v-if="isTypeDropdownOpen" class="type-dropdown">
                            <div class="type-checkboxes">
                                <label v-for="type in availableTypes" :key="type" class="type-checkbox">
                                    <input 
                                        type="checkbox" 
                                        :value="type" 
                                        v-model="selectedTypes"
                                        @change="applySortingAndFiltering"
                                    >
                                    <span class="type-name">{{ type }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Summary Section -->
            <div class="summary-section">
                <div class="summary-stats">
                    <span>Showing: {{ filteredPokemon.length }} unique Pokémon</span>
                    <span>Total captured: {{ totalCaptured }}</span>
                </div>
            </div>
            
            <!-- Content Area -->
            <div class="content-area">
                <!-- Pokemon List View -->
                <div v-if="!showPokemonDetails" class="pokemon-list-container">
                    <div v-if="filteredPokemon.length > 0" class="pokemon-list">
                        <div 
                            v-for="pokemon in filteredPokemon" 
                            :key="pokemon.id"
                            class="pokemon-entry"
                            :class="{ 'caught': isCaught(pokemon.id) }"
                            @click="viewPokemonDetails(pokemon)"
                        >
                            <div class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</div>
                            <div class="pokemon-image">
                                <img 
                                    :src="pokemon.sprites.front_default" 
                                    :alt="pokemon.name"
                                    class="pokemon-sprite"
                                />
                            </div>
                            <div class="pokemon-details">
                                <div class="pokemon-name">{{ formatPokemonName(pokemon.name) }}</div>
                                <div class="pokemon-stats">
                                    <span>Height: {{ pokemon.height / 10 }}m</span>
                                    <span>Speed: {{ getStatValue(pokemon, 'speed') }}</span>
                                </div>
                                <div class="pokemon-types">
                                    <span 
                                        v-for="type in pokemon.types" 
                                        :key="type.type.name"
                                        class="type-badge"
                                        :class="type.type.name"
                                    >
                                        {{ type.type.name }}
                                    </span>
                                </div>
                            </div>
                            <div class="caught-count">
                                <span class="caught-badge">
                                    Caught: {{ getCaughtCount(pokemon.id) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Empty State -->
                    <div v-else class="empty-collection">
                        <div class="empty-message">
                            <h3>No Pokémon Caught Yet</h3>
                            <p>Start your adventure and catch some Pokémon to see them here!</p>
                        </div>
                    </div>
                </div>
                
                <!-- Pokemon Details View -->
                <div v-else class="pokemon-details-container">
                    <!-- Details Header -->
                    <div class="details-header">
                        <button class="back-to-list-button" @click="backToList">
                            ← Back to List
                        </button>
                        
                    </div>
                    
                    <!-- Pokemon Image and Basic Info -->
                    <div class="pokemon-main-info">
                        <div class="pokemon-image-section">
                            <div class="pokemon-info">
                                <h3 class="pokemon-name">{{ formatPokemonName(selectedPokemon.name) }}</h3>
                                <div class="pokemon-number">#{{ selectedPokemon.id.toString().padStart(3, '0') }}</div>                        
                            </div>
                            
                            <div class="pokemon-image-container">
                                <img 
                                    :src="selectedPokemon.sprites.front_default" 
                                    :alt="selectedPokemon.name"
                                    class="pokemon-image"
                                />
                            </div>
                            <div class="pokemon-types">
                                <span 
                                    v-for="type in selectedPokemon.types" 
                                    :key="type.type.name"
                                    class="type-badge"
                                    :class="type.type.name"
                                >
                                    {{ type.type.name }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="basic-stats">
                            <div class="stat-row">
                                <span class="stat-label">Height:</span>
                                <span class="stat-value">{{ selectedPokemon.height / 10 }}m</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Weight:</span>
                                <span class="stat-value">{{ selectedPokemon.weight / 10 }}kg</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Base Experience:</span>
                                <span class="stat-value">{{ selectedPokemon.base_experience }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Detailed Stats -->
                    <div class="detailed-stats-section">
                        <h4>Base Stats</h4>
                        <div class="stats-grid">
                            <div 
                                v-for="stat in selectedPokemon.stats" 
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
                    
                    <!-- Abilities -->
                    <div class="abilities-section">
                        <h4>Abilities</h4>
                        <div class="abilities-list">
                            <div 
                                v-for="ability in selectedPokemon.abilities" 
                                :key="ability.ability.name"
                                class="ability-item"
                                :class="{ 'hidden': ability.is_hidden }"
                            >
                                <span class="ability-name">{{ formatAbilityName(ability.ability.name) }}</span>
                                <span v-if="ability.is_hidden" class="hidden-badge">Hidden</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Back Button -->
            <div class="modal-footer">
                <button class="back-button" @click="closeModal">Back to Game</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useTrainerStore } from '../stores/trainer.js';

export default {
    name: 'PokedexModal',
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
    data() {
        return {
            caughtPokemonData: [], // Will be populated with caught Pokemon data
            sortBy: 'id',
            selectedTypes: [],
            filteredPokemon: [],
            showPokemonDetails: false,
            selectedPokemon: null,
            isTypeDropdownOpen: false,
            isSortDropdownOpen: false,
            sortOptions: [
                { value: 'id', label: 'ID' },
                { value: 'name', label: 'Name' },
                { value: 'height', label: 'Height' },
                { value: 'speed', label: 'Speed' }
            ]
        };
    },
    computed: {
        caughtPokemon() {
            return this.trainerStore.caughtPokemon;
        },
        ownedCount() {
            return this.caughtPokemon.length;
        },
        availableTypes() {
            // Get unique types from caught Pokemon only
            const types = new Set();
            
            this.caughtPokemon.forEach(pokemon => {
                pokemon.types.forEach(type => {
                    types.add(type.type.name);
                });
            });
            return Array.from(types).sort();
        },
        totalCaptured() {
            // Count total number of Pokemon caught (including duplicates)
            return this.caughtPokemon.length;
        }
    },
    watch: {
        isOpen(newVal) {
            if (newVal) {
                // Load Pokemon list when modal opens
                this.loadPokemonList();
            } else {
                // Reset state when modal closes
                this.showPokemonDetails = false;
                this.selectedPokemon = null;
            }
        },
        caughtPokemon: {
            handler() {
                this.loadPokemonList();
            },
            deep: true
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        
        viewPokemonDetails(pokemon) {
            this.selectedPokemon = pokemon;
            this.showPokemonDetails = true;
        },
        
        backToList() {
            this.showPokemonDetails = false;
            this.selectedPokemon = null;
        },
        
        toggleTypeDropdown() {
            this.isTypeDropdownOpen = !this.isTypeDropdownOpen;
        },
        
        toggleSortDropdown() {
            this.isSortDropdownOpen = !this.isSortDropdownOpen;
        },
        
        selectSortOption(value) {
            this.sortBy = value;
            this.isSortDropdownOpen = false;
            this.applySortingAndFiltering();
        },
        
        getSortDisplayName(sortBy) {
            const option = this.sortOptions.find(opt => opt.value === sortBy);
            return option ? option.label : 'ID';
        },
        
        handleClickOutside(event) {
            // Close dropdowns if clicking outside of them
            if (this.isTypeDropdownOpen && !event.target.closest('.filter-controls .dropdown-container')) {
                this.isTypeDropdownOpen = false;
            }
            if (this.isSortDropdownOpen && !event.target.closest('.sort-controls .dropdown-container')) {
                this.isSortDropdownOpen = false;
            }
        },
        
        formatPokemonName(name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        },
        
        isCaught(pokemonId) {
            return this.caughtPokemon.some(pokemon => pokemon.id === pokemonId);
        },
        
        getCaughtCount(pokemonId) {
            return this.caughtPokemon.filter(pokemon => pokemon.id === pokemonId).length;
        },
        
        getStatValue(pokemon, statName) {
            const stat = pokemon.stats.find(s => s.stat.name === statName);
            return stat ? stat.base_stat : 0;
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
        },
        
        formatAbilityName(abilityName) {
            return abilityName.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        },
        
        applySortingAndFiltering() {
            let pokemon = [...this.caughtPokemonData];
            
            // Filter by type if any types are selected
            if (this.selectedTypes.length > 0) {
                pokemon = pokemon.filter(p => 
                    p.types.some(type => this.selectedTypes.includes(type.type.name))
                );
            }
            
            // Sort the filtered results
            pokemon.sort((a, b) => {
                switch (this.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'height':
                        return b.height - a.height; // Tallest first
                    case 'speed':
                        return this.getStatValue(b, 'speed') - this.getStatValue(a, 'speed'); // Fastest first
                    case 'id':
                    default:
                        return a.id - b.id;
                }
            });
            
            this.filteredPokemon = pokemon;
        },
        
        loadPokemonList() {
            // Since caughtPokemon now contains full Pokemon data, we can use it directly
            // Get unique Pokemon from caught Pokemon (remove duplicates by ID)
            const uniquePokemonMap = new Map();
            this.caughtPokemon.forEach(pokemon => {
                if (!uniquePokemonMap.has(pokemon.id)) {
                    uniquePokemonMap.set(pokemon.id, pokemon);
                }
            });
            
            this.caughtPokemonData = Array.from(uniquePokemonMap.values());
            this.applySortingAndFiltering();
        }
    }
};
</script>

<style scoped>

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    font-family: 'Courier New', monospace;
}

.pokedex-modal {
    background: white;
    border: 4px solid #dc2626;
    border-radius: 8px;
    width: 95%;
    max-width: 1000px;
    height: 90%;
    max-height: 700px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.pokedex-header {
    background: #dc2626;
    color: white;
    padding: 1rem;
    text-align: center;
    border-bottom: 2px solid #dc2626;
}

.pokedex-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
}

.controls-section {
    background: #f8f9fa;
    padding: 1rem;
    border-bottom: 2px solid #dc2626;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

.sort-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sort-controls label {
    font-weight: bold;
    color: #dc2626;
    white-space: nowrap;
}

.filter-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.filter-controls label {
    font-weight: bold;
    color: #dc2626;
    white-space: nowrap;
}

.dropdown-container {
    position: relative;
    display: inline-block;
}

.dropdown-button {
    background: white;
    border: 2px solid #dc2626;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 150px;
    justify-content: space-between;
    transition: all 0.2s;
}

.dropdown-button:hover {
    background: #f8f9fa;
}

.dropdown-button.active {
    background: #dc2626;
    color: white;
}

.dropdown-arrow {
    font-size: 0.8rem;
    transition: transform 0.2s;
}

.type-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #dc2626;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
}

.type-checkboxes {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.25rem;
}

.type-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.type-checkbox:hover {
    background: #f8f9fa;
}

.type-checkbox input[type="checkbox"] {
    margin: 0;
}

.type-name {
    font-size: 0.9rem;
    text-transform: capitalize;
}

.sort-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #dc2626;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.sort-options {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.25rem;
}

.sort-option {
    background: none;
    border: none;
    padding: 0.5rem;
    text-align: left;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
    color: #1f2937;
}

.sort-option:hover {
    background: #f8f9fa;
}

.sort-option.selected {
    background: #dc2626;
    color: white;
}

.summary-section {
    background: #dc2626;
    color: white;
    padding: 0.5rem 1rem;
    border-bottom: 2px solid #dc2626;
}

.summary-stats {
    display: flex;
    gap: 2rem;
    font-weight: bold;
}

.content-area {
    flex: 1;
    overflow-y: auto;
    background: white;
}

.pokemon-list-container {
    height: 100%;
}

.pokemon-list {
    padding: 1rem;
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
}

.loading-message {
    text-align: center;
    color: #6b7280;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #dc2626;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-message h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #dc2626;
}

.loading-message p {
    margin: 0;
    font-size: 1.1rem;
    color: #6b7280;
}

.empty-collection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
}

.empty-message {
    text-align: center;
    color: #6b7280;
}

.empty-message h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: #dc2626;
}

.empty-message p {
    margin: 0;
    font-size: 1.1rem;
}

.pokemon-entry {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin: 0.5rem 0;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    transition: all 0.2s;
    cursor: pointer;
}

.pokemon-entry.caught {
    border-color: #dc2626;
    background: #fef2f2;
}

.pokemon-entry:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pokemon-id {
    font-weight: bold;
    color: #dc2626;
    min-width: 60px;
    font-size: 1.1rem;
}

.pokemon-image {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
}

.pokemon-sprite {
    max-width: 70px;
    max-height: 70px;
    object-fit: contain;
}

.pokemon-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pokemon-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #1f2937;
    text-transform: capitalize;
    margin: 0;
    
}

.pokemon-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.pokemon-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #6b7280;
}

.pokemon-types {
    display: flex;
    gap: 0.5rem;
}

.type-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: capitalize;
    color: white;
}

.type-badge.normal { background: #a8a878; }
.type-badge.fire { background: #f08030; }
.type-badge.water { background: #6890f0; }
.type-badge.electric { background: #f8d030; }
.type-badge.grass { background: #78c850; }
.type-badge.ice { background: #98d8d8; }
.type-badge.fighting { background: #c03028; }
.type-badge.poison { background: #a040a0; }
.type-badge.ground { background: #e0c068; }
.type-badge.flying { background: #a890f0; }
.type-badge.psychic { background: #f85888; }
.type-badge.bug { background: #a8b820; }
.type-badge.rock { background: #b8a038; }
.type-badge.ghost { background: #705898; }
.type-badge.dragon { background: #7038f8; }
.type-badge.dark { background: #705848; }
.type-badge.steel { background: #b8b8d0; }
.type-badge.fairy { background: #ee99ac; }

.caught-count {
    min-width: 120px;
    text-align: right;
}

.caught-badge {
    background: #dc2626;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: bold;
}

.not-caught {
    color: #9ca3af;
    font-style: italic;
}

.modal-footer {
    background: #f8f9fa;
    padding: 1rem;
    border-top: 2px solid #dc2626;
    text-align: center;
}

.back-button {
    background: #dc2626;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

.back-button:hover {
    background: #b91c1c;
}

/* Pokemon Details View Styles */
.pokemon-details-container {
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
}

.details-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
}

.back-to-list-button {
    background: #dc2626;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

.back-to-list-button:hover {
    background: #b91c1c;
}

.details-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #dc2626;
    text-transform: capitalize;
    flex: 1;
}

.pokemon-number {
    font-size: 1.2rem;
    color: #6b7280;
    font-weight: bold;
}

.pokemon-main-info {
    display: flex;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
}

.pokemon-image-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.pokemon-image-container {
    background: white;
    border: 3px solid #dc2626;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokemon-image {
    width: 120px;
    height: 120px;
    object-fit: contain;
}

.basic-stats {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
}

.stat-label {
    font-weight: bold;
    color: #dc2626;
    font-size: 1.1rem;
}

.stat-value {
    font-weight: bold;
    color: #1f2937;
    font-size: 1.1rem;
}

.detailed-stats-section {
    margin-bottom: 2rem;
}

.detailed-stats-section h4 {
    margin: 0 0 1rem 0;
    color: #dc2626;
    font-size: 1.3rem;
    text-align: center;
}

.stats-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-name {
    color: #dc2626;
    font-weight: bold;
    min-width: 80px;
    font-size: 1rem;
}

.stat-bar {
    flex: 1;
    height: 16px;
    background: #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    border: 2px solid #dc2626;
}

.stat-fill {
    height: 100%;
    background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
    border-radius: 6px;
    transition: width 0.3s ease;
}

.abilities-section h4 {
    margin: 0 0 1rem 0;
    color: #dc2626;
    font-size: 1.3rem;
    text-align: center;
}

.abilities-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ability-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #f8f9fa;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.2s;
}

.ability-item.hidden {
    background: #fef3c7;
    border-color: #f59e0b;
}

.ability-name {
    font-weight: bold;
    color: #1f2937;
    font-size: 1rem;
}

.hidden-badge {
    background: #f59e0b;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
}

/* Responsive design */
@media (max-width: 768px) {
    .pokedex-modal {
        width: 98%;
        height: 95%;
    }
    
    .controls-section {
        flex-direction: column;
        gap: 1rem;
    }
    
    .type-checkboxes {
        gap: 0.5rem;
    }
    
    .dropdown-button {
        min-width: 120px;
        font-size: 0.8rem;
    }
    
    .type-dropdown,
    .sort-dropdown {
        max-height: 150px;
    }
    
    .pokemon-entry {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
    
    .pokemon-details {
        align-items: center;
    }
    
    .pokemon-stats {
        justify-content: center;
    }
    
    .caught-count {
        text-align: center;
    }
    
    .pokemon-main-info {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .basic-stats {
        width: 100%;
    }
    
    .stat-item {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .stat-name {
        min-width: auto;
    }
    
    .stat-value {
        text-align: center;
    }
    
    .details-header {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .details-header h3 {
        flex: none;
    }
}
</style>
