<template>
    <h1 class="game-title" :class="{ 'title-animated': isAnimating }" :style="{ '--title-size': size }">
        Pokémon Catcher
    </h1>
</template>

<script>
export default {
    name: 'GameTitle',
    props: {
        isAnimating: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: '5.5rem'
        }
    }
}
</script>

<style scoped>

.game-title {
    font-family: 'Courier New', monospace;
    font-size: var(--title-size, 5.5rem);
    font-weight: 900;
    color: #ffde00;
    margin-bottom: 2rem;
    text-shadow: 
        -5px -5px 0 #3b4cca,
        5px -5px 0 #3b4cca,
        -5px 5px 0 #3b4cca,
        5px 5px 0 #3b4cca,
        0 0 10px rgba(59, 76, 202, 0.6);
    position: relative;
    z-index: 4;
    letter-spacing: 2px;
    transition: all 1s ease-in-out;
}

.title-animated {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    transform: translateY(-355px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .title-animated {
        font-size: 2rem;
    }
}
</style>
