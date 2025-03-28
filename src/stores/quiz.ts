import { defineStore } from 'pinia';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
      },
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1
      }
    ] as Question[],
    currentQuestionIndex: 0,
    score: 0,
    gameStarted: false,
    gameCompleted: false
  }),
  
  actions: {
    startGame() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.gameStarted = true;
      this.gameCompleted = false;
    },
    
    answerQuestion(selectedOption: number) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (selectedOption === currentQuestion.correctAnswer) {
        this.score++;
      }
    },
    
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.gameCompleted = true;
      }
    },
    
    resetGame() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.gameStarted = false;
      this.gameCompleted = false;
    }
  },
  
  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    totalQuestions: (state) => state.questions.length,
    isLastQuestion: (state) => state.currentQuestionIndex === state.questions.length - 1
  }
}); 