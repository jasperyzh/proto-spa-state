<template>
  <div class="debug-panel" :class="{ 'collapsed': collapsed }">
    <div class="debug-header" @click="toggleCollapse">
      <h3>Pinia State Debug</h3>
      <span class="toggle-icon">{{ collapsed ? '▼' : '▲' }}</span>
    </div>
    
    <div v-if="!collapsed" class="debug-content">
      <div class="action-log">
        <h4>Last Actions</h4>
        <div class="log-entry" v-for="(log, index) in actionLogs" :key="index">
          {{ log }}
        </div>
      </div>
      
      <div class="state-view">
        <div class="state-section">
          <h4>Game Store</h4>
          <pre>{{ gameStoreState }}</pre>
        </div>
        
        <div class="state-section">
          <h4>Settings Store</h4>
          <pre>{{ settingsStoreState }}</pre>
        </div>
        
        <div class="state-section">
          <h4>Stats Store</h4>
          <pre>{{ statsStoreState }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useStatsStore } from '../stores/statsStore';
import { storeToRefs } from 'pinia';

const collapsed = ref(true);
const actionLogs = ref<string[]>([]);
const MAX_LOGS = 5;

// Store references
const gameStore = useGameStore();
const settingsStore = useSettingsStore();
const statsStore = useStatsStore();

// Computed properties for store states
const gameStoreState = computed(() => {
  const { 
    gameStatus, currentQuestionIndex, timeLeft, score, 
    answerSelected, selectedAnswer, correctAnswer 
  } = gameStore;
  
  return {
    gameStatus,
    currentQuestionIndex,
    timeLeft,
    score,
    answerSelected,
    selectedAnswer,
    correctAnswer,
    questionCount: gameStore.questions ? gameStore.questions.length : 0,
    currentQuestion: gameStore.currentQuestion ? {
      question: gameStore.currentQuestion.question,
      options: gameStore.currentQuestion.options
    } : null
  };
});

const settingsStoreState = computed(() => {
  const { difficulty, soundEnabled, timerSeconds, pointsMultiplier } = settingsStore;
  return { 
    difficulty, 
    soundEnabled, 
    currentTimerSeconds: settingsStore.currentTimerSeconds,
    currentPointsMultiplier: settingsStore.currentPointsMultiplier 
  };
});

const statsStoreState = computed(() => {
  const { highScore, gamesPlayed } = statsStore;
  return { 
    highScore, 
    gamesPlayed,
    averageScore: statsStore.averageScore,
    recentGames: statsStore.gameHistory.slice(0, 3)
  };
});

// Watch for changes in the game store to log actions
watch(() => gameStore.gameStatus, (newStatus, oldStatus) => {
  if (newStatus !== oldStatus) {
    actionLogs.value.unshift(`[GameStore] Game status changed: ${oldStatus} → ${newStatus}`);
    trimLogs();
  }
});

watch(() => gameStore.score, (newScore, oldScore) => {
  if (newScore > oldScore) {
    actionLogs.value.unshift(`[GameStore] Score increased: ${oldScore} → ${newScore} (+${newScore - oldScore})`);
    trimLogs();
  }
});

watch(() => settingsStore.difficulty, (newDifficulty, oldDifficulty) => {
  if (newDifficulty !== oldDifficulty) {
    actionLogs.value.unshift(`[SettingsStore] Difficulty changed: ${oldDifficulty} → ${newDifficulty}`);
    trimLogs();
  }
});

function trimLogs() {
  if (actionLogs.value.length > MAX_LOGS) {
    actionLogs.value = actionLogs.value.slice(0, MAX_LOGS);
  }
}

function toggleCollapse() {
  collapsed.value = !collapsed.value;
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 350px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  border-top-left-radius: 8px;
  font-family: monospace;
  z-index: 9999;
  transition: height 0.3s ease;
}

.debug-panel.collapsed {
  height: 40px;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background-color: #222;
  cursor: pointer;
  border-top-left-radius: 8px;
}

.debug-content {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.action-log {
  margin-bottom: 15px;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}

.log-entry {
  padding: 4px;
  border-left: 3px solid #00aa00;
  margin: 4px 0;
  font-size: 0.85rem;
  background-color: rgba(0, 100, 0, 0.2);
}

.state-section {
  margin-bottom: 15px;
}

pre {
  background-color: rgba(0, 30, 0, 0.5);
  padding: 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  overflow-x: auto;
}

h4 {
  margin: 5px 0;
  color: #aaffaa;
}
</style> 