import { Link } from "react-router-dom";
import styled from "styled-components"

import { nameLegend, pictureLegend, portraitLegend } from '../../util/legends';

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
            <LinkText to={`/user/${username}`}>
              {nameLegend[username] ? nameLegend[username] : username}
              {portraitLegend[username] &&
                <VerifiedIcon className="fas fa-check fa-xs" title="This user has been verified."></VerifiedIcon>
              }
            </LinkText>
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
            <LinkText to={`/user/${username}`}>
              {nameLegend[username] ? nameLegend[username] : username}
              {portraitLegend[username] &&
                <VerifiedIcon className="fas fa-check fa-xs" title="This user has been verified."></VerifiedIcon>
              }
            </LinkText>
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
  background: rgba(146,165,37,0.12);
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

const LinkText = styled(Link)`
  text-align: center;
  font-size: 0.8rem;
  margin: auto 0;
  color: rgb(102, 187, 255);
  text-decoration: none;
`

const VerifiedIcon = styled.i`
  margin-left: 3px;
  color: #68d1f6;
`