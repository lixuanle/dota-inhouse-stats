import { useEffect, useState } from "react"
import { readRemoteFile } from 'react-papaparse'

import logo from './logo.svg';
import './App.css';

import readCSV from "./util/parser"

const App = () => {

  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const getCSV = async () => {
      const results = await readCSV();
      console.log(results);
    }
    getCSV();
  })
  

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
