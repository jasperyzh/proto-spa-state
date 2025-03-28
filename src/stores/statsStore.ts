import { defineStore } from 'pinia';

interface GameResult {
  score: number;
  difficulty: string;
  date: string;
}

interface StatsState {
  highScore: number;
  gamesPlayed: number;
  gameHistory: GameResult[];
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    highScore: 0,
    gamesPlayed: 0,
    gameHistory: []
  }),
  
  getters: {
    averageScore: (state) => {
      if (state.gamesPlayed === 0) return 0;
      const totalScore = state.gameHistory.reduce((sum, game) => sum + game.score, 0);
      return Math.round(totalScore / state.gamesPlayed);
    },
    
    bestGame: (state) => {
      if (state.gameHistory.length === 0) return null;
      return state.gameHistory.reduce((best, current) => 
        current.score > best.score ? current : best, state.gameHistory[0]);
    }
  },
  
  actions: {
    recordGame(score: number, difficulty: string) {
      const gameResult: GameResult = {
        score,
        difficulty,
        date: new Date().toISOString()
      };
      
      this.gameHistory.push(gameResult);
      this.gamesPlayed++;
      
      if (score > this.highScore) {
        this.highScore = score;
      }
    },
    
    clearStats() {
      this.$patch({
        highScore: 0,
        gamesPlayed: 0,
        gameHistory: []
      });
    }
  }
}); 