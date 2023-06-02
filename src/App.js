//CSS
import './App.css';

//REACT
import { useCallback, useEffect, useState } from 'react';

//data
import wordsList from './Data/words'

//components
import GameOver from './components/GameOver'
import StartScreen from './components/StartScreen'
import Game from './components/Game'

const stages = [
  {id:1, name: 'start'},
  {id:2, name: 'game'},
  {id:3, name: 'end'}
]

function App() {
  const guessesQtd = 3
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [wrongLetters, setWrongLetters] = useState([])
  const [score, setScore] = useState(0)

  const pickWordAndCategory = ()=>{
    //pick a randm category
    const categories = Object.keys(words)
    const random_category = Math.floor(Math.random()* categories.length)
    const category = categories[random_category]

    //pick a random word
    const random_word = Math.floor(Math.random()* words[category].length)
    const word = words[category][random_word]
    return {word, category}
  }
  /** starts the game */
  const startGame = ()=>{
    //clear all letter
    clearLetterStates()
    const {word, category} = pickWordAndCategory()
    let word_letters = word.split("").map((l)=> l.toLowerCase())
    setPickedWord(word)
    setPickedCategory(category)
    setGameStage(stages[1].name)
    setLetters(word_letters)
  }

  /** process letter input */
  const verifyLetter = (letter)=>{
    const normalize_letter = letter.toLowerCase()
    //check if the letter has already been used
    if(guessedLetters.includes(normalize_letter)||wrongLetters.includes(normalize_letter))
      return

    //pushed a letter or remove a guess
    if(letters.includes(normalize_letter)){
      setGuessedLetters((actualGuessedLetter)=>[
        ...actualGuessedLetter,
        normalize_letter
      ])
    }else{
      setWrongLetters((actualWrongLetter)=>[
        ...actualWrongLetter, 
        normalize_letter
      ])

      setGuesses((actualGuesses)=> actualGuesses-1)
    }
  }

  useEffect(()=>{
    if(guesses <=0){
      //reset all states
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(()=>{
    const unique_letters = [...new Set(letters)]
    //win condition
    if(guessedLetters.length === unique_letters.length && guessedLetters.length !== 0){
      setScore((actualScore)=> actualScore+100)
      startGame()
    }
  }, [guessedLetters])

  const clearLetterStates = ()=>{
    setGuessedLetters([])
    setWrongLetters([])
  }
  
  const retry = () =>{
    setScore(0)
    setGuesses(guessesQtd)
    setGameStage(stages[0].name)
    startGame()
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' &&
          <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}/>}

      {gameStage === 'end' && <GameOver score={score}  retry={retry}/>}
    </div>
  );
}

export default App;
