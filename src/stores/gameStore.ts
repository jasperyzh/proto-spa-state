import { defineStore } from 'pinia';
import axios from 'axios';

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options?: string[];
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameStatus: 'idle' as 'idle' | 'playing' | 'ended',
    currentQuestionIndex: 0,
    questions: null as Question[] | null,
    timeLeft: 0,
    score: 0,
    timerInterval: null as number | null,
    answerSelected: false,
    selectedAnswer: null as string | null,
    correctAnswer: null as string | null,
  }),
  
  getters: {
    currentQuestion(state) {
      return state.questions ? state.questions[state.currentQuestionIndex] : null;
    },
    totalQuestions(state) {
      return state.questions ? state.questions.length : 0;
    },
    isLastQuestion(state) {
      return state.questions ? state.currentQuestionIndex === state.questions.length - 1 : false;
    },
    questionOptions(state) {
      const current = this.currentQuestion;
      if (!current) return [];
      return current.options || [];
    },
    gameProgress(state) {
      const total = this.totalQuestions;
      return total ? (state.currentQuestionIndex / total) * 100 : 0;
    }
  },
  
  actions: {
    async fetchQuestions(difficulty: string = 'medium') {
      try {
        const { data } = await axios.get(
          `https://opentdb.com/api.php?amount=8&difficulty=${difficulty}&type=multiple`
        );
        
        if (data.response_code === 0) {
          // Process questions to include shuffled options
          this.questions = data.results.map((q: Question) => {
            const allOptions = [...q.incorrect_answers, q.correct_answer];
            // Shuffle options
            const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
            return { ...q, options: shuffledOptions };
          });
        } else {
          throw new Error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        this.questions = null;
      }
    },
    
    startGame() {
      this.gameStatus = 'playing';
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.startTimer();
    },
    
    startTimer() {
      // Get time based on difficulty from settings store (will integrate later)
      const timePerQuestion = 8; // Default for now
      this.timeLeft = timePerQuestion;
      
      // Clear any existing timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeExpired();
        }
      }, 1000) as unknown as number;
    },
    
    timeExpired() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      // Auto-process as incorrect if time runs out
      this.answerSelected = true;
      this.correctAnswer = this.currentQuestion?.correct_answer || null;
      
      // Auto-advance after a short delay
      setTimeout(() => {
        this.nextQuestion();
      }, 2000);
    },
    
    submitAnswer(answer: string) {
      if (this.answerSelected) return;
      
      this.answerSelected = true;
      this.selectedAnswer = answer;
      this.correctAnswer = this.currentQuestion?.correct_answer || null;
      
      // Clear timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      // Calculate score based on correctness and time left
      if (answer === this.correctAnswer) {
        // Base points + time bonus
        const timeBonus = this.timeLeft;
        this.score += 100 + timeBonus * 10;
      }
      
      // Auto-advance after a delay to show feedback
      setTimeout(() => {
        this.nextQuestion();
      }, 1500);
    },
    
    nextQuestion() {
      this.answerSelected = false;
      this.selectedAnswer = null;
      this.correctAnswer = null;
      
      if (this.currentQuestionIndex < (this.totalQuestions - 1)) {
        this.currentQuestionIndex++;
        this.startTimer();
      } else {
        this.endGame();
      }
    },
    
    endGame() {
      this.gameStatus = 'ended';
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    },
    
    resetGame() {
      this.$patch({
        gameStatus: 'idle',
        currentQuestionIndex: 0,
        score: 0,
        timeLeft: 0,
        answerSelected: false,
        selectedAnswer: null,
        correctAnswer: null
      });
      
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
  }
}); 