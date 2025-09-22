import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function HangmanScreen() {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [remainingGuesses, setRemainingGuesses] = useState<number>(6);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Array<{question: string, answer: string}>>([]);

  useEffect(() => {
    const config = require('./config.json');
    const questionList = [];
    
    if (config.question && config.answer) {
      questionList.push({ question: config.question, answer: config.answer.toUpperCase() });
    }
    if (config.question2 && config.answer2) {
      questionList.push({ question: config.question2, answer: config.answer2.toUpperCase() });
    }
    
    setQuestions(questionList);
    if (questionList.length > 0) {
      setQuestion(questionList[0].question);
      setAnswer(questionList[0].answer);
    }
  }, []);

  const displayWord = () => {
    return answer.split('').map(letter => 
      guesses.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const makeGuess = () => {
    if (!currentGuess || currentGuess.length !== 1) {
      Alert.alert('Invalid Input', 'Please enter a single letter');
      return;
    }

    const upperGuess = currentGuess.toUpperCase();
    
    if (guesses.includes(upperGuess)) {
      Alert.alert('Already Guessed', 'You have already guessed this letter');
      return;
    }

    const newGuesses = [...guesses, upperGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (!answer.includes(upperGuess)) {
      const newRemaining = remainingGuesses - 1;
      setRemainingGuesses(newRemaining);
      
      if (newRemaining === 0) {
        setGameOver(true);
      }
    } else {
      const isWon = answer.split('').every(letter => newGuesses.includes(letter));
      if (isWon) {
        setGameWon(true);
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setRemainingGuesses(6);
    setGameOver(false);
    setGameWon(false);
  };

  const nextQuestion = () => {
    if (questions.length > 1) {
      const nextIndex = (currentQuestionIndex + 1) % questions.length;
      setCurrentQuestionIndex(nextIndex);
      setQuestion(questions[nextIndex].question);
      setAnswer(questions[nextIndex].answer);
      resetGame();
    } else {
      resetGame();
    }
  };

  const getWrongGuesses = () => {
    const wrongGuesses = guesses.filter(letter => !answer.includes(letter));
    return wrongGuesses.map(() => '❌').join(' ');
  };

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
      <View className={`top-12 p-4 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <Text className={`text-2xl font-bold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Hangman Game
        </Text>
      </View>

      <View className="flex-1 p-3 pt-14">
        <View className={`p-3 rounded-lg mb-3 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <Text className={`text-base font-semibold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {question}
          </Text>
        </View>

        <View className={`p-4 rounded-lg mb-3 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <Text className={`text-3xl font-bold text-center tracking-widest ${colorScheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            {displayWord()}
          </Text>
        </View>

        <View className="flex-row mb-3 space-x-2">
          <View className={`flex-1 p-3 rounded-lg ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <Text className={`text-sm font-bold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Wrong:
            </Text>
            <Text className={`text-lg text-center ${colorScheme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              {getWrongGuesses() || 'None'}
            </Text>
          </View>
          <View className={`flex-1 p-3 rounded-lg ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <Text className={`text-sm font-bold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Left:
            </Text>
            <Text className={`text-lg text-center font-bold ${remainingGuesses <= 2 ? 'text-red-500' : remainingGuesses <= 4 ? 'text-yellow-500' : 'text-green-500'}`}>
              {remainingGuesses}
            </Text>
          </View>
        </View>

        {guesses.length > 0 && (
          <View className={`p-2 rounded-lg mb-3 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <Text className={`text-sm font-semibold text-center ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Guessed: {guesses.join(' ')}
            </Text>
          </View>
        )}

          <View className={`p-3 rounded-lg mb-3 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <Text className={`text-sm font-semibold text-center mb-3 ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Make a guess:
            </Text>
            <View>
              <TextInput
                className={`text-xl font-bold text-center w-14 h-14 rounded-lg border-2 mx-auto mb-3 ${
                  colorScheme === 'dark' 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-gray-100 text-black border-gray-300'
                }`}
                value={currentGuess}
                onChangeText={setCurrentGuess}
                maxLength={1}
                autoCapitalize="characters"
              />
              <Pressable
                className={`px-6 py-3 rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
                onPress={makeGuess}
                disabled={!currentGuess || gameOver}
              >
                <Text className="text-white text-base font-bold text-center">GUESS</Text>
              </Pressable>
            </View>
        </View>

        {gameOver && (
          <View className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4`}>
            <View className={`p-6 rounded-xl ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
              <Text className={`text-2xl font-bold text-center mb-4  ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
                {gameWon ? '🎉 You Won!' : '💀 Game Over!'}
              </Text>
              <Text className={`text-base text-center mb-4 ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {gameWon ? 'Congratulations!' : `Answer: ${answer}`}
              </Text>
              <View>
                <Pressable
                  className={`px-6 py-3 rounded-lg mb-3 ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
                  onPress={resetGame}
                >
                  <Text className="text-white text-base font-bold text-center">Play Again</Text>
                </Pressable>
                {questions.length > 1 && (
                  <Pressable
                    className={`px-6 py-3 rounded-lg ${colorScheme === 'dark' ? 'bg-green-600' : 'bg-green-500'}`}
                    onPress={nextQuestion}
                  >
                    <Text className="text-white text-base font-bold text-center">Next Question</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}