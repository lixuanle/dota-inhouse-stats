import { Link } from "react-router-dom";
import styled from "styled-components"

import { nameLegend, pictureLegend } from '../../util/legends';

const MatchDetails = ({ matchDetails }) => {
  const radiantTeam = matchDetails.filter((_, index) => index % 2 === 0);
  const direTeam = matchDetails.filter((_, index) => index % 2 === 1);

  return (
    <MatchContainer>
      <TeamHeader style={{ padding: "6px 0 "}}>
        <DetailText>Hero</DetailText>
        <DetailText>Player</DetailText>
        <DetailText>Kills</DetailText>
        <DetailText>Deaths</DetailText>
        <DetailText>Assists</DetailText>
        <DetailText>Damage</DetailText>
      </TeamHeader>
      {radiantTeam?.map(({ username, hero, kills, deaths, assists, damage }) => (
        <RadiantTeamContainer key={damage}>
          <TeamHeader>
            <img src={pictureLegend[hero]} height={32} style={{ margin: "0 auto"}} alt={`${nameLegend[hero]} icon`} />
            <Link style={{ textAlign: "center", fontSize: "0.8rem", margin: "auto 0" }} to={`/user/${username}`}>{nameLegend[username] ? nameLegend[username] : username}</Link>
            <DetailText>{kills}</DetailText>
            <DetailText>{deaths}</DetailText>
            <DetailText>{assists}</DetailText>
            <DetailText>{damage}</DetailText>
          </TeamHeader>
        </RadiantTeamContainer>
      ))}
      {direTeam?.map(({ username, hero, kills, deaths, assists, damage }) => (
        <DireTeamContainer key={damage}>
          <TeamHeader>
            <img src={pictureLegend[hero]} height={32} style={{ margin: "0 auto"}} alt={`${nameLegend[hero]} icon`}  />
            <Link style={{ textAlign: "center", fontSize: "0.8rem", margin: "auto 0" }} to={`/user/${username}`}>{username}</Link>
            <DetailText>{kills}</DetailText>
            <DetailText>{deaths}</DetailText>
            <DetailText>{assists}</DetailText>
            <DetailText>{damage}</DetailText>
          </TeamHeader>
        </DireTeamContainer>
      ))}
    </MatchContainer>
  )
}

export default MatchDetails;

const MatchContainer = styled.div`
  border: 1px solid black;
`

const RadiantTeamContainer = styled.div`
  background-color: rgb(0, 51, 0, 0.2);
`

const TeamHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
`

const DireTeamContainer = styled.div`
  background-color: rgb(255, 105, 1, 0.2);
`

const DetailText = styled.p`
  font-size: 0.8rem;
  margin: auto 0;
  text-align: center;
`