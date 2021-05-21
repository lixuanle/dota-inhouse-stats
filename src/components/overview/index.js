import { useState } from "react";
import styled from "styled-components";

import MatchDetails from "../details"
import { pictureLegend } from "../../util/legends";

const MatchOverview = ({ matchDetails }) => {

  const [isOpen, setIsOpen] = useState(false);

  const radiantTeam = matchDetails.filter((_, index) => index % 2 === 0);
  const direTeam = matchDetails.filter((_, index) => index % 2 === 1);
  
  return (
    <MatchOverviewContainer>
      <InformationContainer onClick={() => setIsOpen(!isOpen)}>
        <div style={{ margin: "auto 0", display: "flex", paddingLeft: "15px"}} >
          {radiantTeam.map(({ hero }) => (
            <div key={hero}>
              <HeroIcon src={`${pictureLegend[hero]}`} alt={`${hero} icon`} />
            </div>
          ))}
        </div>
        <div style={{ margin: "auto 0", display: "flex" }} >
          {direTeam.map(({ hero }) => (
            <div key={hero}>
              <HeroIcon src={`${pictureLegend[hero]}`} alt={`${hero} icon`} />
            </div>
          ))}
        </div>
        <DownArrow src="/dota-inhouse-stats/arrow-down.png" isOpen={isOpen}/>
      </InformationContainer>
      {isOpen && 
        <MatchDetails 
          matchDetails={matchDetails}
        />
      }
    </MatchOverviewContainer>
  )
}

export default MatchOverview;

const MatchOverviewContainer = styled.div`
  margin: 0 auto;
`

const InformationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #eaeae1;
  padding: 5px 10px;
  background-color: #fafbfc;

  &:hover {
    cursor:pointer;
  }
`

const HeroIcon = styled.img`
  height: 32px;
`

const DownArrow = styled.img`
  width: 32px;
  height: 32px;
  transform: ${({ isOpen }) => isOpen ? "rotate(180deg)" : ""}
`