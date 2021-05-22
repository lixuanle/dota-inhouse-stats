import { readString } from 'react-papaparse'
import { heroLegend } from './legends';

const readCSV = async () => {
  const response = await fetch('https://raw.githubusercontent.com/lixuanle/dota-inhouse-stats/main/public/data/game-stats.csv');
  const data = await response.text();
  const { data: csvData } = readString(data);
  if (csvData.length > 0) {

    let listOfGames = [];
    let gameToAdd = [];
    let playerStats = {};
    let heroPicks = {};
    let sideWins = { radiant: 0, dire: 0 };
    let counter = 0;

    for (const row of csvData.slice(1)) {

      if (row[1] !== "Winner: ") {

        // In hindsight I could probably destruct the array and make one of these variables for each item instead of doing row[i] all the time but future me can deal with that.
        const radiantPlayer = row[1].toLowerCase();
        const direPlayer = row[7].toLowerCase();

        // 2 blocks of code to keep a history of each game, the players in it, the heroes played, and the stats.
        gameToAdd.push({
          username: radiantPlayer,
          side: "Radiant",
          kills: row[2],
          deaths: row[3],
          assists: row[4],
          hero: row[5],
          damage: row[6],
          winner: row[13] === radiantPlayer ? true : false
        });

        gameToAdd.push({
          username: direPlayer,
          side: "Dire",
          kills: row[8],
          deaths: row[9],
          assists: row[10],
          hero: row[11],
          damage: row[12],
          winner: row[13] === direPlayer ? true : false
        });

        if (counter === 4) {

        listOfGames.push(gameToAdd);
        gameToAdd = [];
          counter = -1;
        }

        counter+=1;

        // Initialize a base object for the Radiant player if they don't already exist in the object.
        if (!playerStats[radiantPlayer]) {
          playerStats[radiantPlayer] = {
            heroesPlayed: {},
            peers: {},
            kills: 0,
            deaths: 0,
            assists: 0,
            damage: 0,
            wins: 0,
            losses: 0,
          }
        }

        // Initialize a base object for the Dire player if they don't already exist in the object.
        if (!playerStats[direPlayer]) {
          playerStats[direPlayer] = {
            heroesPlayed: {},
            peers: {},
            kills: 0,
            deaths: 0,
            assists: 0,
            damage: 0,
            wins: 0,
            losses: 0,
          }
        }

        // Block of code to check if the hero exists in that players object and adds it if it doesn't exist. If it exists, it updates accordingly.
        // row[5] = Radiant hero played.
        // row[11] = Dire hero played.
        // row[13] = Winning player.
        if (!playerStats[radiantPlayer].heroesPlayed[row[5]]) {
          playerStats[radiantPlayer].heroesPlayed[row[5]] = {
            played: 1,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
          }
        } else {
          playerStats[radiantPlayer].heroesPlayed[row[5]]["played"] += 1
        }

        playerStats[radiantPlayer].heroesPlayed[row[5]]["kills"] += parseInt(row[2]);
        playerStats[radiantPlayer].heroesPlayed[row[5]]["deaths"] += parseInt(row[3]);
        playerStats[radiantPlayer].heroesPlayed[row[5]]["assists"] += parseInt(row[4]);

        if (row[13] === radiantPlayer) {
          playerStats[radiantPlayer].heroesPlayed[row[5]]["wins"] += 1;
        } else {
          playerStats[radiantPlayer].heroesPlayed[row[5]]["losses"] += 1;
        }
      
        
        // Same block as above but to track Dire side.
        if (!playerStats[direPlayer].heroesPlayed[row[11]]) {
          playerStats[direPlayer].heroesPlayed[row[11]] = {
            played: 1,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
          }
        } else {
          playerStats[direPlayer].heroesPlayed[row[11]]["played"] += 1
        }

        playerStats[direPlayer].heroesPlayed[row[11]]["kills"] += parseInt(row[8]);
        playerStats[direPlayer].heroesPlayed[row[11]]["deaths"] += parseInt(row[9]);
        playerStats[direPlayer].heroesPlayed[row[11]]["assists"] += parseInt(row[10]);

        if (row[13].toLowerCase() === direPlayer) {
          playerStats[direPlayer].heroesPlayed[row[11]]["wins"] += 1;
        } else {
          playerStats[direPlayer].heroesPlayed[row[11]]["losses"] += 1;
        }
        
        // Block of code to check if the hero exists in that total picks object and adds it if it doesn't exist. If it exists, it updates accordingly.
        // row[5] = Radiant hero played.
        // row[11] = Dire hero played.
        // row[13] = Winning player.
        if (!heroPicks[heroLegend[row[5]]]) {
          heroPicks[heroLegend[row[5]]] = {
            played: 1,
            wins: 0,
            losses: 0
          }
        } else {
          heroPicks[heroLegend[row[5]]]["played"] += 1
        }

        if (row[13].toLowerCase() === radiantPlayer) {
          heroPicks[heroLegend[row[5]]]["wins"] += 1;
        } else {
          heroPicks[heroLegend[row[5]]]["losses"] += 1;
        }

        // Same block of code as above but to keep track of Dire side.
        if (!heroPicks[heroLegend[row[11]]]) {
          heroPicks[heroLegend[row[11]]] = {
            played: 1,
            wins: 0,
            losses: 0,
          }
        } else {
          heroPicks[heroLegend[row[11]]]["played"] += 1;
        }

        if (row[13].toLowerCase() === direPlayer) {
          heroPicks[heroLegend[row[11]]]["wins"] += 1;
        } else {
          heroPicks[heroLegend[row[11]]]["losses"] += 1;
        }

        // 2 blocks of code to update the running sum of all the corresponding stats per player.
        playerStats[radiantPlayer].kills += parseInt(row[2]);
        playerStats[radiantPlayer].deaths += parseInt(row[3]);
        playerStats[radiantPlayer].assists += parseInt(row[4]);
        playerStats[radiantPlayer].damage += parseInt(row[6]);
        playerStats[radiantPlayer].wins += (row[13] === radiantPlayer ? 1 : 0);
        playerStats[radiantPlayer].losses += (row[13] !== radiantPlayer ? 1 : 0);

        playerStats[direPlayer].kills += parseInt(row[8]);
        playerStats[direPlayer].deaths += parseInt(row[9]);
        playerStats[direPlayer].assists += parseInt(row[10]);
        playerStats[direPlayer].damage += parseInt(row[12]);
        playerStats[direPlayer].wins += (row[13] === direPlayer ? 1 : 0);
        playerStats[direPlayer].losses += (row[13] !== direPlayer ? 1 : 0);

      } else {
        // If the csv line is Winner: Dire/Radiant, this block will update the wins for that side.
        if (row[2] === 'Dire') {
          sideWins.dire += 1
        } else {
          sideWins.radiant += 1
        }
      }
    }

    // This probably does not scale at ALL, but for what we have now its that bad.
    // The ideal case here is that we switch to the league API, but on the other hand we probably will never get more than 1000 games and even then performance wouldn't tank. Probably.
    for (const game of listOfGames) {
      // Cross references the player with the other players in the match, and checks to see who won that match.
      for (const player of game) {
        const { username, side, winner } = player;
        for (const otherPlayer of game) {
          const { username: otherUsername, side: otherSide } = otherPlayer;
          if (username !== otherUsername) {
            if (!playerStats[username].peers[otherUsername]) {
              playerStats[username].peers[otherUsername] = {
                played: 1,
                wonWith: 0,
                lostWith: 0,
                wonAgainst: 0,
                lostAgainst: 0,
              }
            } else {
              playerStats[username].peers[otherUsername].played += 1;
            }
            if (side === otherSide && winner) {
              playerStats[username].peers[otherUsername].wonWith += 1;
            } else if (side === otherSide && !winner) {
              playerStats[username].peers[otherUsername].lostWith += 1;
            } else if (side !== otherSide && winner) {
              playerStats[username].peers[otherUsername].wonAgainst += 1;
            } else {
              playerStats[username].peers[otherUsername].lostAgainst += 1;
            }
          }
        }
      }
    }

    return { listOfGames, playerStats, heroPicks, sideWins };
  }
}

export default readCSV;