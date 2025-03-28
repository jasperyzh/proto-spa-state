# Vue 3 + Pinia Quiz Game 🎮

> [!summary] **TLDR:** A modern quiz application built with Vue 3, Pinia, and TypeScript, featuring real-time state management, difficulty levels, and a debug panel for learning Pinia patterns.

## 🚀 Quickstart

```bash
# Clone the repository
git clone <repository-url>
cd vue3-pinia-quiz

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the application in action.

## 🎯 Features

- **Dynamic Quiz System**
  - Fetch questions from Open Trivia DB
  - Multiple difficulty levels (Easy, Medium, Hard)
  - Time-based scoring with bonuses
  - Real-time feedback on answers

- **State Management with Pinia**
  - Modular store architecture
  - Real-time state visualization
  - Persistent settings and statistics
  - Type-safe store definitions

- **Developer Experience**
  - TypeScript for type safety
  - Debug panel for state inspection
  - Action logging system
  - Responsive design

## 📚 Tutorial: Building the Quiz Game

### 1. Project Setup
```bash
# Create new Vue project
npm create vite@latest vue3-pinia-quiz -- --template vue-ts

# Install dependencies
npm install pinia axios pinia-plugin-persistedstate
```

### 2. Store Architecture
The application uses three main stores:

```typescript
// gameStore.ts - Manages game state
export const useGameStore = defineStore('game', {
  state: () => ({
    gameStatus: 'idle' | 'playing' | 'ended',
    questions: Question[] | null,
    score: number,
    // ... other state
  })
});

// settingsStore.ts - Handles user preferences
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    difficulty: 'easy' | 'medium' | 'hard',
    soundEnabled: boolean,
    // ... other settings
  })
});

// statsStore.ts - Tracks game statistics
export const useStatsStore = defineStore('stats', {
  state: () => ({
    highScore: number,
    gamesPlayed: number,
    // ... other stats
  })
});
```

### 3. Key Components
- `QuizGame.vue`: Main game component
- `DebugPanel.vue`: State visualization tool
- `App.vue`: Application root

## 🔧 How-to Guides

### Adding New Features

1. **Implementing Sound Effects**
   ```typescript
   // In QuizGame.vue
   function playSound(sound: 'correct' | 'incorrect') {
     if (settingsStore.soundEnabled) {
       const audio = new Audio(`/sounds/${sound}.mp3`);
       audio.play();
     }
   }
   ```

2. **Customizing Difficulty Settings**
   ```typescript
   // In settingsStore.ts
   timerSeconds: {
     easy: 8,
     medium: 6,
     hard: 4
   }
   ```

### Debugging

1. **Using the Debug Panel**
   - Click the "Pinia State Debug" panel in the bottom-right corner
   - Monitor state changes in real-time
   - View action logs and store snapshots

2. **Common Issues**
   - API connection issues: Check network tab for Open Trivia DB responses
   - State persistence: Verify localStorage configuration
   - Timer synchronization: Check interval cleanup in component unmount

## 📖 API Reference

### Store Actions

#### GameStore
- `fetchQuestions(difficulty: string)`: Fetches questions from Open Trivia DB
- `startGame()`: Initializes new game session
- `submitAnswer(answer: string)`: Processes user answer
- `nextQuestion()`: Advances to next question
- `endGame()`: Finalizes game session

#### SettingsStore
- `setDifficulty(difficulty: Difficulty)`: Updates game difficulty
- `toggleSound()`: Toggles sound effects
- `resetSettings()`: Restores default settings

#### StatsStore
- `recordGame(score: number, difficulty: string)`: Records game results
- `clearStats()`: Resets all statistics

### Store Getters

#### GameStore
- `currentQuestion`: Returns current question object
- `totalQuestions`: Returns total question count
- `isLastQuestion`: Checks if current question is last
- `gameProgress`: Calculates game progress percentage

## 🎨 Examples

### State Management Pattern
```typescript
// Example of using multiple stores together
function submitAnswer(answer: string) {
  gameStore.submitAnswer(answer);
  
  if (settingsStore.soundEnabled) {
    playSound(answer === gameStore.correctAnswer ? 'correct' : 'incorrect');
  }
  
  if (gameStore.isLastQuestion) {
    statsStore.recordGame(gameStore.score, settingsStore.difficulty);
  }
}
```

### Component Integration
```vue
<template>
  <div class="quiz-game">
    <div v-if="gameStore.gameStatus === 'playing'">
      <Timer :time-left="gameStore.timeLeft" />
      <Question :question="gameStore.currentQuestion" />
      <Options :options="gameStore.questionOptions" />
    </div>
  </div>
</template>
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
src/
├── components/
│   ├── QuizGame.vue
│   └── DebugPanel.vue
├── stores/
│   ├── gameStore.ts
│   ├── settingsStore.ts
│   └── statsStore.ts
├── types/
│   └── index.ts
├── App.vue
└── main.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Pinia](https://pinia.vuejs.org/) - State Management Library
- [Open Trivia DB](https://opentdb.com/) - Quiz Questions API
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling

---

Made with ❤️ by [Your Name] 