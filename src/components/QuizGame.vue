<template>
  <div class="quiz-game">
    <!-- Start Screen -->
    <div v-if="gameStore.gameStatus === 'idle'" class="screen start-screen">
      <h1>Quiz Challenge</h1>
      <div class="start-options">
        <button @click="startGame" class="btn primary-btn">Start Game</button>
        <button @click="showSettings = true" class="btn secondary-btn">Settings</button>
      </div>
      
      <!-- Settings Panel -->
      <div v-if="showSettings" class="settings-panel">
        <h2>Game Settings</h2>
        <div class="setting-group">
          <h3>Difficulty</h3>
          <div class="difficulty-options">
            <button 
              v-for="diff in ['easy', 'medium', 'hard']" 
              :key="diff" 
              @click="setDifficulty(diff)"
              :class="{ 'selected': settingsStore.difficulty === diff }"
              class="difficulty-btn"
            >
              {{ diff.charAt(0).toUpperCase() + diff.slice(1) }}
            </button>
          </div>
          <p class="setting-info">
            Time: {{ settingsStore.timerSeconds[settingsStore.difficulty] }}s per question<br>
            Points: {{ settingsStore.pointsMultiplier[settingsStore.difficulty] }}x multiplier
          </p>
        </div>
        
        <div class="setting-group">
          <h3>Sound</h3>
          <label class="toggle">
            <input type="checkbox" v-model="soundEnabled" @change="settingsStore.toggleSound()">
            <span class="toggle-slider"></span>
            <span class="toggle-label">{{ settingsStore.soundEnabled ? 'On' : 'Off' }}</span>
          </label>
        </div>
        
        <button @click="showSettings = false" class="btn primary-btn">Save Settings</button>
      </div>
    </div>
    
    <!-- Game Screen -->
    <div v-else-if="gameStore.gameStatus === 'playing'" class="screen game-screen">
      <div class="game-header">
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: `${gameStore.gameProgress}%` }"></div>
        </div>
        <div class="game-info">
          <div class="question-counter">
            Question {{ gameStore.currentQuestionIndex + 1 }}/{{ gameStore.totalQuestions }}
          </div>
          <div class="score">Score: {{ gameStore.score }}</div>
        </div>
      </div>
      
      <div class="timer-container">
        <div class="timer-bar" :style="{ width: `${(gameStore.timeLeft / settingsStore.currentTimerSeconds) * 100}%` }"></div>
        <div class="timer-text">{{ gameStore.timeLeft }}s</div>
      </div>
      
      <div class="question-container">
        <h2 class="question" v-html="gameStore.currentQuestion?.question"></h2>
        
        <div class="options-container">
          <button 
            v-for="(option, index) in gameStore.questionOptions" 
            :key="index"
            @click="submitAnswer(option)"
            :disabled="gameStore.answerSelected"
            :class="{
              'correct': gameStore.answerSelected && option === gameStore.correctAnswer,
              'incorrect': gameStore.answerSelected && option === gameStore.selectedAnswer && option !== gameStore.correctAnswer,
              'unselected': gameStore.answerSelected && option !== gameStore.selectedAnswer && option !== gameStore.correctAnswer
            }"
            class="option-btn"
            v-html="option"
          ></button>
        </div>
      </div>
    </div>
    
    <!-- Results Screen -->
    <div v-else-if="gameStore.gameStatus === 'ended'" class="screen results-screen">
      <h1>Quiz Complete!</h1>
      <div class="results-info">
        <div class="final-score">{{ gameStore.score }}</div>
        <div class="score-label">POINTS</div>
        
        <div class="stats-container">
          <div class="stat">
            <div class="stat-value">{{ statsStore.highScore }}</div>
            <div class="stat-label">High Score</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ statsStore.gamesPlayed }}</div>
            <div class="stat-label">Games Played</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ statsStore.averageScore }}</div>
            <div class="stat-label">Avg Score</div>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="restartGame" class="btn primary-btn">Play Again</button>
        <button @click="goToStart" class="btn secondary-btn">Main Menu</button>
      </div>
    </div>
    
    <!-- Debug Panel -->
    <DebugPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { useSettingsStore } from '../stores/settingsStore'; 
import { useStatsStore } from '../stores/statsStore';
import DebugPanel from './DebugPanel.vue';

// Store references
const gameStore = useGameStore();
const settingsStore = useSettingsStore();
const statsStore = useStatsStore();

// Local state
const showSettings = ref(false);
const soundEnabled = ref(settingsStore.soundEnabled);

// Initialize game on component mount
onMounted(async () => {
  await fetchQuestions();
});

// Methods
async function fetchQuestions() {
  await gameStore.fetchQuestions(settingsStore.difficulty);
}

function startGame() {
  gameStore.startGame();
}

function submitAnswer(answer: string) {
  gameStore.submitAnswer(answer);
  
  // Play sound effect if enabled
  if (settingsStore.soundEnabled) {
    const sound = answer === gameStore.correctAnswer ? 'correct' : 'incorrect';
    playSound(sound);
  }
}

function setDifficulty(difficulty: string) {
  settingsStore.setDifficulty(difficulty as 'easy' | 'medium' | 'hard');
}

function restartGame() {
  // Record the completed game in stats
  statsStore.recordGame(gameStore.score, settingsStore.difficulty);
  
  // Reset and restart
  gameStore.resetGame();
  fetchQuestions().then(() => {
    gameStore.startGame();
  });
}

function goToStart() {
  // Record the completed game in stats
  statsStore.recordGame(gameStore.score, settingsStore.difficulty);
  
  // Reset game state
  gameStore.resetGame();
}

function playSound(sound: 'correct' | 'incorrect') {
  // Simple sound implementation - can be enhanced with actual sound files
  console.log(`Playing ${sound} sound`);
  // const audio = new Audio(`/sounds/${sound}.mp3`);
  // audio.play();
}
</script>

<style scoped>
.quiz-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.screen {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

/* Start Screen */
.start-screen {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.start-screen h1 {
  font-size: 2.5rem;
  color: #4361ee;
  margin-bottom: 40px;
}

.start-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

/* Settings Panel */
.settings-panel {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
}

.settings-panel h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group h3 {
  color: #4361ee;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.difficulty-options {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.difficulty-btn {
  background-color: #e9ecef;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.difficulty-btn.selected {
  background-color: #4361ee;
  color: white;
}

.setting-info {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 8px;
}

.toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  margin-right: 10px;
  transition: .4s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

input:checked + .toggle-slider {
  background-color: #4361ee;
}

input:checked + .toggle-slider:before {
  transform: translateX(16px);
}

/* Game Screen */
.game-screen {
  justify-content: flex-start;
}

.game-header {
  margin-bottom: 20px;
}

.progress-container {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4361ee;
  transition: width 0.3s ease;
}

.game-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #6c757d;
}

.timer-container {
  height: 20px;
  background-color: #f8d7da;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.timer-bar {
  height: 100%;
  background-color: #dc3545;
  transition: width 0.1s linear;
}

.timer-text {
  position: absolute;
  top: 0;
  right: 10px;
  color: #721c24;
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 20px;
}

.question-container {
  flex-grow: 1;
}

.question {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #2c3e50;
}

.options-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.option-btn {
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  transition: all 0.2s;
}

.option-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.option-btn.correct {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.option-btn.incorrect {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.option-btn.unselected {
  opacity: 0.6;
}

/* Results Screen */
.results-screen {
  align-items: center;
  text-align: center;
}

.results-screen h1 {
  color: #4361ee;
  margin-bottom: 30px;
}

.results-info {
  margin-bottom: 30px;
}

.final-score {
  font-size: 4rem;
  font-weight: bold;
  color: #4361ee;
}

.score-label {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 20px;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.stat {
  flex: 1;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background-color: #4361ee;
  color: white;
}

.primary-btn:hover {
  background-color: #3a56d4;
}

.secondary-btn {
  background-color: #e9ecef;
  color: #2c3e50;
}

.secondary-btn:hover {
  background-color: #dee2e6;
}
</style> 