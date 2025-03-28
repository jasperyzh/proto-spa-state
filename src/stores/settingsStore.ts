import { defineStore } from 'pinia';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface SettingsState {
  difficulty: Difficulty;
  soundEnabled: boolean;
  timerSeconds: Record<Difficulty, number>;
  pointsMultiplier: Record<Difficulty, number>;
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    difficulty: 'medium',
    soundEnabled: true,
    timerSeconds: {
      easy: 8,
      medium: 6,
      hard: 4
    },
    pointsMultiplier: {
      easy: 1,
      medium: 1.5,
      hard: 2
    }
  }),
  
  getters: {
    currentTimerSeconds: (state) => state.timerSeconds[state.difficulty],
    currentPointsMultiplier: (state) => state.pointsMultiplier[state.difficulty]
  },
  
  actions: {
    setDifficulty(difficulty: Difficulty) {
      this.difficulty = difficulty;
    },
    
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
    },
    
    resetSettings() {
      this.$patch({
        difficulty: 'medium',
        soundEnabled: true
      });
    }
  },
  
  // Enable persistence to localStorage
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'quiz-settings',
        storage: localStorage
      }
    ]
  }
}); 