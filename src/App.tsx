
import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { Container, TextField, Typography } from '@mui/material';
import { ModeGuess } from './models/ModGuess';

function App() {

  const [ word, setWord] = useState("");
  const [ guesses, setGuesses] = useState(Array<string>());
  const [ modGuesses, setModGuesses] = useState(Array<Array<ModeGuess>>());
  const [currGuess, setCurrGuess] = useState("");
  const modGuess : ModeGuess[] = [];

  const fetchApi = useCallback(async () => {
    try{
      const response = await fetch('http://www.localhost:3000/word',);
      const data = await response.json();
      setWord(data.word); 
      localStorage.setItem('Word Data',data)// Assuming the API returns a JSON ModeGuess with a 'word' property

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect( () => {
    fetchApi();
  }, [fetchApi]);

  useEffect( () => {
    for( let i = 0; i < currGuess.length; i++){
      const modGuessChar = {letter: currGuess[i], isPresent: false, isPlaced: false}
      if(word.toLowerCase().indexOf(currGuess[i].toLowerCase()) !== -1){
        modGuessChar.isPresent = true;
      }
      if(word[i].toLowerCase() == currGuess[i].toLowerCase()){
        modGuessChar.isPlaced = true;
      }
      modGuess.push(modGuessChar);
    }
    if(modGuess.length  > 0){
      setModGuesses([...modGuesses, modGuess]);
    }

  }, [guesses])


  return (
    <>
      <div className="App">
        {
          modGuesses.map(( guess, index ) => {
            console.log(guess);
            return(
              <Container key={index} sx={{display:'flex', flexDirection: 'row', gap: '1px'}}>
                {
                  guess.map((char, ind) => {
                    
                    const color = char.isPlaced ? 'green' : char.isPresent ? 'yellow' : 'white';
                    return (
                      <div key = {ind} style={{ alignContent: 'center', justifyContent: 'center' , backgroundColor: color , color:'black', height: 30, width: 50, border: '1px solid black', marginBottom: 1  }}>
                        <Typography>{char.letter}</Typography>
                      </div>
                    )
                  })
                }
              </Container>
            )
          })
        }
        
        <TextField 
        onKeyDown={ (e)=> {
          if(e.key == 'Enter' && (currGuess.length == 5)){
            setGuesses([...guesses, currGuess.toUpperCase()])
          }
        }}
        onChange={(e) => {
          setCurrGuess(e.currentTarget.value)
        }}
        sx={{backgroundColor: 'white', marginTop: 3}}
        slotProps={{ htmlInput: {maxLength: 5} }}>

        </TextField>
      </div>
    </>
  )
}

export default App
