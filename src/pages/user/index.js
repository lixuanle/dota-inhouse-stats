import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styled from "styled-components";

import CustomTooltip from "../../components/custom-tooltip";
import { heroLegend, nameLegend, pictureLegend, portraitLegend } from '../../util/legends';

const UserPage = ({ individualStats }) => {
  const { id } = useParams();
  const [sortedHeroData, setSortedHeroData] = useState();
  const [sortedPeerData, setSortedPeerData] = useState()
  const [sortCategory, setSortCategory] = useState("")

  useEffect(() => {
    if (individualStats) {
      const { heroesPlayed, peers } = individualStats[id];
      const heroData = [];
      const peerData = [];

      for (const heroName in heroesPlayed) {
        heroData.push({
        heroName: heroName, 
          ...heroesPlayed[heroName]},
        )
      }

      heroData.sort((a,b) => {
        if (heroLegend[a.heroName] < heroLegend[b.heroName]) {
          return -1;
        } else if (heroLegend[a.heroName] > heroLegend[b.heroName]) {
          return 1;
        }
        return 0;
      })

      for (const peerName in peers) {
        peerData.push({
          peerName: peerName.toLowerCase(),
          ...peers[peerName.toLowerCase()]
        })
      }
      peerData.sort((a,b) => {
        if (a.played > b.played) {
          return -1;
        } else if (a.played < b.played) {
          return 1;
        }
        return 0;
      })

      // console.log(peerData);
      setSortedHeroData(heroData);
      setSortedPeerData(peerData);
    }
  }, [id, individualStats])

  const sortArray = (category, array) => {
    const newArray = (array === "hero") ? [...sortedHeroData] : [...sortedPeerData];
    // console.log(newArray);
    if (category === "gamesPlayed") {
      newArray.sort((a,b) => {
        if (a.played < b.played) {
          return sortCategory === category ? -1 : 1
        } else if (a.played > b.played) {
          return sortCategory === category ? 1 : -1
        }
        return 0
      })
    } else if (category === "kda") {
      newArray.sort((a,b) => {
        const aKillRate = (a.kills/a.played);
        const aDeathsRate = (a.deaths/a.played);
        const aAssistsRate = (a.assists/a.played);
        const bKillRate = (b.kills/b.played);
        const bDeathsRate = (b.deaths/b.played);
        const bAssistsRate = (b.assists/b.played);
        if ((aKillRate+aAssistsRate)/aDeathsRate < (bKillRate+bAssistsRate)/bDeathsRate) {
          return sortCategory === category ? -1 : 1
        } else if ((aKillRate+aAssistsRate)/aDeathsRate > (bKillRate+bAssistsRate)/bDeathsRate) {
          return sortCategory === category ? 1 : -1
        }
        return 0
      })
    } else {
      newArray.sort((a,b) => {
        if (a[category]/a.played < b[category]/b.played) {
          return sortCategory === category ? -1 : 1
        } else if (a[category]/a.played > b[category]/b.played) {
          return sortCategory === category ? 1 : -1
        }
        return 0
      })
    }
    if (array === "hero") {
      setSortedHeroData(newArray);
    } else {
      setSortedPeerData(newArray)
    }
    setSortCategory(category);
  }

  if (individualStats) {
    const { kills, assists, deaths, damage, wins, losses } = individualStats[id];
    const totalGames = wins + losses;
    const userWinrate = ((wins/totalGames)*100).toFixed(2);

    return (
      <>
        <UserPageContainer>
          <MainPageSubheader>
            User stats for: { nameLegend[id] ? nameLegend[id] : id }
            {portraitLegend[id] &&
              <VerifiedIcon className="fas fa-check fa-xs" title="This user has been verified."></VerifiedIcon>
            }
          </MainPageSubheader>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerPortrait src={portraitLegend[id]} />
          </div>
          <UserStatistics>
            <div>
              <UserInfoText>Winrate</UserInfoText>
              <UserInfoText rateColor={userWinrate > 50}>{userWinrate}%</UserInfoText>
            </div>
            <div>
              <UserInfoText>Games Played</UserInfoText>
              <UserInfoText>{totalGames}</UserInfoText>
            </div>
            <div>
              <UserInfoText>Kills</UserInfoText>
              <UserInfoText>{(kills/totalGames).toFixed(2)}</UserInfoText>
            </div>
            <div>
              <UserInfoText>Deaths</UserInfoText>
              <UserInfoText>{(deaths/totalGames).toFixed(2)}</UserInfoText>
            </div>
            <div>
              <UserInfoText>Assists</UserInfoText>
              <UserInfoText>{(assists/totalGames).toFixed(2)}</UserInfoText>
            </div>
            <div>
              <UserInfoText>Damage</UserInfoText>
              <UserInfoText>{Math.floor(damage/totalGames)}</UserInfoText>
            </div>
          </UserStatistics>
          <HeroStatistics>
            <h3>Hero Statistics</h3>
            <HeroHeader>
              <UserInfoText onClick={() => sortArray('gamesPlayed', 'hero')}>Games Played</UserInfoText>
              <UserInfoText onClick={() => sortArray('wins', 'hero')}>Winrate</UserInfoText>
              <UserInfoText onClick={() => sortArray('kills', 'hero')}>Average Kills</UserInfoText>
              <UserInfoText onClick={() => sortArray('deaths', 'hero')}>Average Deaths</UserInfoText>
              <UserInfoText onClick={() => sortArray('assists', 'hero')}>Average Assists</UserInfoText>
              <UserInfoText onClick={() => sortArray('kda', 'hero')}>KDA</UserInfoText>
            </HeroHeader>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {sortedHeroData?.map(({ heroName, played, wins, losses, kills, deaths, assists }) => {
                const winRate = ((wins/played)*100).toFixed(2);
                const killRate = (kills/played);
                const deathsRate = (deaths/played);
                const assistsRate = (assists/played);
                return(
                  <HeroContainer key={heroName}>
                    <div style={{ display: "flex" }}>
                      <HeroIcon src={`${pictureLegend[heroName]}`} alt={`${heroName} icon`} />
                      <HeroText>{heroLegend[heroName]}</HeroText>
                    </div>
                    <HeroText>{played}</HeroText>
                    <HeroText rateColor={winRate > 50}>{winRate}%</HeroText>
                    <HeroText>{killRate.toFixed(2)}</HeroText>
                    <HeroText>{deathsRate.toFixed(2)}</HeroText>
                    <HeroText>{assistsRate.toFixed(2)}</HeroText>
                    <HeroText>{((killRate + assistsRate)/deathsRate).toFixed(2)}</HeroText>
                  </HeroContainer>
                )
              })}
            </div>
            <BarChart
              width={750}
              height={400}
              data={sortedHeroData}
              margin={{
                top: 50,
                right: 30,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="heroName" tick={false} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="wins" fill="#8884d8" />
              <Bar dataKey="played" fill="#82ca9d" />
              {/* <Brush dataKey="played" height={30} stroke="#8884d8" /> */}
            </BarChart>
          </HeroStatistics>
          <PeerStatistics>
            <h3>Peer Statistics</h3>
            <PeerHeader>
              <PeerInfoText onClick={() => sortArray('gamesPlayed', 'peers')}>Games Played</PeerInfoText>
              <PeerInfoText onClick={() => sortArray('wonWith', 'peers')}>Won With</PeerInfoText>
              <PeerInfoText onClick={() => sortArray('lostWith', 'peers')}>Lost With</PeerInfoText>
              <PeerInfoText onClick={() => sortArray('wonAgainst', 'peers')}>Won Against</PeerInfoText>
              <PeerInfoText onClick={() => sortArray('lostAgainst', 'peers')}>Lost Against</PeerInfoText>
            </PeerHeader>
            {sortedPeerData?.map(({ peerName, played, wonWith, lostWith, wonAgainst, lostAgainst }) => {
              const wonWithRate = (wonWith/(wonWith + lostWith) * 100).toFixed(2);
              const lostWithRate = (lostWith/(wonWith + lostWith) * 100).toFixed(2);
              const wonAgainstRate = (wonAgainst/(wonAgainst + lostAgainst) * 100).toFixed(2);
              const lostAgainstRate = (lostAgainst/(wonAgainst + lostAgainst) * 100).toFixed(2);
              return (
                <PeerContainer>
                  <PeerLink to={`/user/${peerName}`}>{peerName}</PeerLink>
                  <PeerText>{played}</PeerText>
                  <PeerText>{wonWith}
                    <PeerRateText rateColor={wonWithRate > 50}>
                      ({!isNaN(wonWithRate) ? wonWithRate : 0 }%)
                    </PeerRateText>
                  </PeerText>
                  <PeerText>{lostWith}
                    <PeerRateText rateColor={lostWithRate > 50}>
                        ({!isNaN(lostWithRate) ? lostWithRate : 0 }%)
                    </PeerRateText>
                  </PeerText>
                  <PeerText>{wonAgainst}
                    <PeerRateText rateColor={wonAgainstRate > 50}>
                      ({!isNaN(wonAgainstRate)? wonAgainstRate : 0 }%)
                    </PeerRateText>
                  </PeerText>
                  <PeerText>{lostAgainst}
                    <PeerRateText rateColor={lostAgainstRate > 50}>
                      ({!isNaN(lostAgainstRate) ? lostAgainstRate : 0 }%)
                    </PeerRateText>
                  </PeerText>
                </PeerContainer>
              )
            })}
          </PeerStatistics>
        </UserPageContainer>
      </>
    )
  } return null
}

export default UserPage;

const UserPageContainer = styled.div`
  max-width: 750px;
  margin: 0 auto;
  padding: 30px;
`

const MainPageSubheader = styled.h2`
  text-align: center;
  border: 1px solid #eaeae1;
  padding: 50px;
`

const VerifiedIcon = styled.i`
  margin-left: 5px;
  color: #68d1f6;
`

const PlayerPortrait = styled.img`
  width: 30%;
`

const UserStatistics = styled.div`
  border: 1px solid #eaeae1;
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
`

const HeroStatistics = styled.div`
  border: 1px solid #eaeae1;
  padding-bottom: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  & > h3 {
    text-align: center;
  }
`

const PeerStatistics = styled.div`
  border: 1px solid #eaeae1;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  & > h3 {
    text-align: center;
  }
`

const HeroHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  font-size: 0.6rem;
  width: 90%;
  margin: 0 auto;
  text-align: center;
  & > p:nth-child(1) {
    grid-column-start: 2;
  }
  & > p {
    cursor: pointer;
  }
`

const HeroContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  margin: 0 auto;
  width: 90%;
`

const HeroText = styled.p`
  margin: auto 0;
  width: 100%;
  font-size: 0.7rem;
  padding-left: 4px;
  text-align: center;
  color: ${({ rateColor }) => {
    if (rateColor !== undefined) {
      return rateColor ? "rgb(102, 187, 106)" : "rgb(255, 76, 76)";
    }
  }};

`

const UserInfoText = styled.p`
  text-align: center;
`

const HeroIcon = styled.img`
  height: 32px;
`

const PeerContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  margin: 0 auto;
  width: 90%;
`

const PeerHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  font-size: 0.6rem;
  width: 90%;
  margin: 0 auto;
  text-align: center;
  & > h3:nth-child(1) {
    grid-column-start: 2;
  }
  cursor: pointer;
`

const PeerInfoText = styled.h3`
  text-align: center;
`

const PeerLink = styled(Link)`
  color: rgb(102, 187, 255);
  text-decoration: none;
  font-size: 0.8rem;
`

const PeerText = styled.p`
  margin: auto 0;
  width: 100%;
  font-size: 0.7rem;
  text-align: center;
`

const PeerRateText = styled.span`
  color: ${({ rateColor }) => rateColor ? "rgb(102, 187, 106)" : "rgb(255, 76, 76)"};
`