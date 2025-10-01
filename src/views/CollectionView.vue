<template>
    <main class="collection-gallery">
        <h1>Page Title</h1>

        [collection-view]
        <footer class="collection-filter-summary">
            <!-- Total Unique Pokemon: 0 -->
            <!-- Total Captured Pokemon: 0 -->
        </footer>
    </main>
</template>

<script>
import { useTrainerStore } from '../stores/trainer.js';

export default {
    setup() {
        const trainerStore = useTrainerStore();
        return { trainerStore };
    },
    mounted() {
        // Check if trainer has a name, if not redirect to home
        if (!this.trainerStore.hasName) {
            this.$router.push('/');
        }
    }
}
</script>
