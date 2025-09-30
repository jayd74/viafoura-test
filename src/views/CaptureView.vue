<template>
    <main class="capture-container">
        <h1 class="capture-title">Pokémon Catcher</h1>
        <div class="capture-content">
            <p>Welcome to the Pokémon catching adventure!</p>
            <!-- Capture view content will go here -->
        </div>
    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jersey+20:wght@400&display=swap');

* {
    font-family: 'Jersey 20', monospace;
}

.capture-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.capture-title {
    font-size: 3rem;
    font-weight: 900;
    color: #ffde00;
    margin-bottom: 2rem;
    text-shadow: 
        -3px -3px 0 #3b4cca,
        3px -3px 0 #3b4cca,
        -3px 3px 0 #3b4cca,
        3px 3px 0 #3b4cca,
        0 0 10px rgba(59, 76, 202, 0.6);
    letter-spacing: 2px;
}

.capture-content {
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    text-align: center;
    max-width: 600px;
}

.capture-content p {
    font-size: 1.2rem;
    color: #2c3e50;
    margin: 0;
}
</style>
