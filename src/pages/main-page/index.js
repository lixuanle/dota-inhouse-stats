import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components"

import MatchOverview from "../../components/overview"
import { heroLegend } from "../../util/legends";

const bronsonTicks = [
  "Paper, Nala",
  "Pussy wine",
  "The dick slam",
  "The gahlick",
  "Fuggit homes",
  "Baby swap?",
  "Lickle ting",
  "Pussy lips",
  "Swear tho",
  "Sheeeeeeeesh",
  "I'll give you 2 options",
  "Anyone but Huskar",
  "Should've bought Safemoon when I told you guys",
  "🥁 REMIA 🥁 REMIA 🥁",
  "Not the sannin man",
  "Fuck a Papa Doc, fuck a clock, fuck everybody",
]

const MainPage = ({ initialData, matchHistory, setMatchHistory, individualStats }) => {
  const [ searchText, setSearchText ] = useState("");
  const [ bronsonQuote, setBronsonQuote ] = useState("");
  const [ warningMessage, setWarningMessage ] = useState(false);

  let history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    setBronsonQuote(bronsonTicks[Math.floor(Math.random() * bronsonTicks.length + 1)]);
  }, [setMatchHistory])

  useEffect(() => {
    setMatchHistory(initialData);
  }, [initialData, setMatchHistory])

  const handleChange = ({ target: { value }}) => {
    setSearchText(value);
    setWarningMessage(false);
    let filteredResult = [];
    if (value.length >= 1) {
      for (const game of initialData) {
        for (const user of game) {
          if (user["username"].toLowerCase().indexOf(value.toLowerCase()) > -1 ) {
            filteredResult.push(game);
            break;
          } else if (user["hero"].toLowerCase().indexOf(value.toLowerCase()) > -1 || heroLegend[user["hero"]].toLowerCase().indexOf(value.toLowerCase()) > -1) {
            filteredResult.push(game);
            break;
          }
        }
      }
      setMatchHistory(filteredResult)
    } else {
      setMatchHistory(initialData);
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (individualStats[searchText]) {
      setWarningMessage(false);
      history.push(`/user/${searchText}`)
    } else {
      setWarningMessage(true);
    }
  }

  return (
    <>  
      <MainContainer> 
        <MainPageSubheader>🗣️: {bronsonQuote}</MainPageSubheader>
        <form onSubmit={handleSubmit}>
          <SearchBar type="text" value={searchText} onChange={handleChange} placeholder="Search by name or hero.."/>
          {warningMessage && 
            <p style={{ color: "#B00020", margin: "0" }}>Player "{searchText}" does not exist!</p>
          }
        </form>
        <MatchHistoryContainer>
          <p>{initialData.length} total games recorded.</p>
          <p>Searching for games containing player: { searchText.length >= 1 ? searchText : "" }</p>
          {matchHistory?.map((game, index) => (
            <MatchOverview 
              matchDetails={game}
              index={index}
              key={index}
            />
          ))}
        </MatchHistoryContainer>
      </MainContainer>
    </>
  )
}

export default MainPage;

const MainPageSubheader = styled.h2`
  margin: 50px auto;
  text-align: center;
  border: 1px solid #eaeae1;
  padding: 50px;
`

const SearchBar = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em 0 0.5em 40px;
  margin-bottom: 30px;
  background-image:url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwd9t9-J2wwy7hv6S_V95qXYCCN8cMpolIiOjQomirSZ1TtBjAqA');
  background-repeat: no-repeat;
  background-position: 9px 5px;
  background-size: 20px 20px;
`

const MainContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
`

const MatchHistoryContainer = styled.div`
  background-color: #16283e;
  padding: 15px;
`