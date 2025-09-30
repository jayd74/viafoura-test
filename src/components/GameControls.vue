<script>
export default {
    methods: {
        showCollectionView() {
            this.$router.push('/collection');
        },
        quitGame() {
            this.$router.push('/');
        }
    }
};
</script>

<template>
    <form id="form-controls">
        <fieldset>
            <legend>Controls</legend>

            <button name="btn-find">Find</button>
            <button name="btn-ignore" disabled>Ignore</button>
            <button name="btn-throw" disabled>Throw</button>

            <button name="btn-collection" @click.prevent="showCollectionView">
                Pokedex (0)
            </button>

            <button name="btn-quit" @click.prevent="quitGame">Quit</button>
        </fieldset>
    </form>
</template>
