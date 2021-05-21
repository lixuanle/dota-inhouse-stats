import { useEffect, useState } from "react";
import styled from "styled-components"

import MatchOverview from "../../components/overview"

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
]

const MainPage = ({ initialData, matchHistory, setMatchHistory }) => {
  const [ searchText, setSearchText ] = useState("");
  const [ bronsonQuote, setBronsonQuote ] = useState("");

  useEffect(() => {
    setBronsonQuote(bronsonTicks[Math.floor(Math.random() * bronsonTicks.length + 1)]);
    setMatchHistory(initialData);
  }, [initialData, setMatchHistory])

  const handleChange = e => {
    setSearchText(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    let filteredResult = [];
    if (searchText.length > 1) {
      for (const game of initialData) {
        for (const user of game) {
          if (user["username"].toLowerCase().indexOf(searchText.toLowerCase()) > -1 ) {
            filteredResult.push(game);
          }
        }
      }
      setMatchHistory(filteredResult)
    }
  }

  return (
    <>  
      <MainPageHeader>Inhouse Stats For Animals</MainPageHeader>
      <MainContainer> 
        <MainPageSubheader>🗣️: {bronsonQuote}</MainPageSubheader>
        <form onSubmit={handleSubmit}>
          <SearchBar type="text" value={searchText} onChange={handleChange} placeholder="Search by name.."/>
        </form>
        {matchHistory?.map((game, index) => (
          <MatchOverview 
            matchDetails={game}
            index={index}
            key={index}
          />
        ))}
      </MainContainer>
    </>
  )
}

export default MainPage;

const MainPageHeader = styled.h1`
  background-color: #24292e;
  text-align: center;
  color: white;
  padding: 50px;
`

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
  background-color: 
`