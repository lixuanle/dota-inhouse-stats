import { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { createGlobalStyle } from 'styled-components'

import MainPage from "./pages/main-page";
import UserPage from "./pages/user";
import readCSV from "./util/parser"

const App = () => {

  const [ initialData, setInitialData ] = useState([]);
  const [ matchHistory, setMatchHistory ] = useState([]);
  const [ individualStats, setIndividualStats ] = useState()
  const [ , setHeroData ] = useState();
  // const [ winData, setWinData ] = useState()

  useEffect(() => {
    const getCSV = async () => {
      const { listOfGames, playerStats, heroPicks } = await readCSV();
      console.log(listOfGames)
      setMatchHistory([...listOfGames].reverse());
      setInitialData([...listOfGames].reverse());
      setIndividualStats(playerStats);
      setHeroData(heroPicks);
      // setWinData(sideWins);
    }
    getCSV();
  }, [])

  return (
    <>
      <GlobalStyle />
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/">
            <MainPage 
              matchHistory={matchHistory}
              initialData={initialData}
              setMatchHistory={setMatchHistory}
              individualStats={individualStats}
            />
          </Route>
          <Route exact path={`/user/:id`}>
            <UserPage 
              individualStats={individualStats}
              initialData={initialData}
            />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #16283e;
    color: #FFFFFF;
  }
`