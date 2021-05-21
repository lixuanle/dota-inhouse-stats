import { useEffect, useState } from "react"

import logo from './logo.svg';
import './App.css';

import readCSV from "./util/parser"

const App = () => {

  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const getCSV = async () => {
      const { listOfGames, playerStats } = await readCSV();
      console.log(listOfGames);
      setCsvData(listOfGames);
    }
    getCSV();
  }, [])

  useEffect(() => {
  
  }, [csvData])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
