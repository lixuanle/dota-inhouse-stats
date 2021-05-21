import { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

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
      setMatchHistory(listOfGames);
      setInitialData(listOfGames);
      setIndividualStats(playerStats);
      setHeroData(heroPicks);
      // setWinData(sideWins);
    }
    getCSV();
  }, [])

  return (
    <Router>
      <Switch>
        <Route exact path="/dota-inhouse-stats/">
          <MainPage 
            matchHistory={matchHistory}
            initialData={initialData}
            setMatchHistory={setMatchHistory}
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
  );
}

export default App;