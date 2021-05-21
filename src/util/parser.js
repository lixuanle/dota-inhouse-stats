import { readString } from 'react-papaparse'
import { heroLegend } from './legends';

const readCSV = async () => {
  const response = await fetch('https://raw.githubusercontent.com/lixuanle/dota-inhouse-stats/main/public/data/game-stats.csv');
  const data = await response.text();
  const { data: csvData } = readString(data);
  if (csvData.length > 0) {

    let listOfGames = {};
    let gameNum = 0;
    let playerStats = {};
    let heroPicks = {};
    let sideWins = { radiant: 0, dire: 0 };
    let radiantPlayers = [];
    let direPlayers = [];
    let counter = 0;

    for (const row of csvData.slice(1)) {

      // Uses column 1 of the CSV to keep track of the game number.
      if (row[0].length > 0) {
        gameNum = row[0];
        listOfGames[gameNum] = {
          "radiant": {},
          "dire": {},
          "winner": ""
        };
      }

      if (row[1] !== "Winner: ") {

        // In hindsight I could probably destruct the array and make one of these variables for each item instead of doing row[i] all the time but future me can deal with that.
        const radiantPlayer = row[1];
        const direPlayer = row[7];

        radiantPlayers.push(radiantPlayer)
        direPlayers.push(direPlayer);

        if (counter === 4) {
          listOfGames[gameNum].radiantPlayers = [...radiantPlayers];
          listOfGames[gameNum].direPlayers = [...direPlayers];
          radiantPlayers = [];
          direPlayers = [];
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
        if (!playerStats[radiantPlayer].heroesPlayed[heroLegend[row[5]]]) {
          playerStats[radiantPlayer].heroesPlayed[heroLegend[row[5]]] = {
            played: 1,
            wins: 0,
            losses: 0,
          }
          if (row[13] === radiantPlayer) {
            playerStats[radiantPlayer].heroesPlayed[heroLegend[row[5]]]["wins"] += 1;
          } else {
            playerStats[radiantPlayer].heroesPlayed[heroLegend[row[5]]]["losses"] += 1;
          }
        } else {
          playerStats[radiantPlayer].heroesPlayed[heroLegend[row[5]]]["played"] += 1
          if (row[13] === radiantPlayer) {
            playerStats[radiantPlayer].heroesPlayed[heroLegend[row[5]]]["wins"] += 1;
          } else {
            playerStats[radiantPlayer].heroesPlayed[heroLegend[row[5]]]["losses"] += 1;
          }
        }
        
        // Same block as above but to track Dire side.
        if (!playerStats[direPlayer].heroesPlayed[heroLegend[row[11]]]) {
          playerStats[direPlayer].heroesPlayed[heroLegend[row[11]]] = {
            played: 1,
            wins: 0,
            losses: 0
          }
          if (row[13] === direPlayer) {
            playerStats[direPlayer].heroesPlayed[heroLegend[row[11]]]["wins"] += 1;
          } else {
            playerStats[direPlayer].heroesPlayed[heroLegend[row[11]]]["losses"] += 1;
          }
        } else {
          playerStats[direPlayer].heroesPlayed[heroLegend[row[11]]]["played"] += 1
          if (row[13] === direPlayer) {
            playerStats[direPlayer].heroesPlayed[heroLegend[row[11]]]["wins"] += 1;
          } else {
            playerStats[direPlayer].heroesPlayed[heroLegend[row[11]]]["losses"] += 1;
          }
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
          if (row[13] === radiantPlayer) {
            heroPicks[heroLegend[row[5]]]["wins"] += 1;
          } else {
            heroPicks[heroLegend[row[5]]]["losses"] += 1;
          }
        } else {
          heroPicks[heroLegend[row[5]]]["played"] += 1
          if (row[13] === radiantPlayer) {
            heroPicks[heroLegend[row[5]]]["wins"] += 1;
          } else {
            heroPicks[heroLegend[row[5]]]["losses"] += 1;
          }
        }

        // Same block of code as above but to keep track of Dire side.
        if (!heroPicks[heroLegend[row[11]]]) {
          heroPicks[heroLegend[row[11]]] = {
            played: 1,
            wins: 0,
            losses: 0,
          }
          if (row[13] === direPlayer) {
            heroPicks[heroLegend[row[11]]]["wins"] += 1;
          } else {
            heroPicks[heroLegend[row[11]]]["losses"] += 1;
          }
        } else {
          heroPicks[heroLegend[row[11]]]["played"] += 1;
          if (row[13] === direPlayer) {
            heroPicks[heroLegend[row[11]]]["wins"] += 1;
          } else {
            heroPicks[heroLegend[row[11]]]["losses"] += 1;
          }
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

        // 2 blocks of code to keep a history of each game, the players in it, the heroes played, and the stats.
        listOfGames[gameNum].radiant[radiantPlayer] = {
          kills: row[2],
          deaths: row[3],
          assists: row[4],
          hero: row[5],
          damage: row[6],
          winner: row[13] === radiantPlayer ? true : false
        };

        listOfGames[gameNum].dire[direPlayer] = {
          kills: row[8],
          deaths: row[9],
          assists: row[10],
          hero: row[11],
          damage: row[12],
          winner: row[13] === direPlayer ? true : false
        };

      } else {
        // If the csv line is Winner: Dire/Radiant, this block will update the wins for that side.
        if (row[2] === 'Dire') {
          listOfGames[gameNum].winner = "Dire"
          sideWins.dire += 1
        } else {
          sideWins.radiant += 1
          listOfGames[gameNum].winner = "Radiant"
        }
      }
    }

    // FAT code block to parse the peer data. This probably does not scale at ALL, but for what we have now its that bad.
    for (const game in listOfGames) {
      for (const radiantPlayer of listOfGames[game].radiantPlayers) {
        for (const radiantPlayer2 of listOfGames[game].radiantPlayers) {
          if (radiantPlayer !== radiantPlayer2) {
            if (!playerStats[radiantPlayer].peers[radiantPlayer2]) {
              playerStats[radiantPlayer].peers[radiantPlayer2] = {
                played: 1,
                wonWith: 0,
                lostWith: 0,
                wonAgainst: 0,
                lostAgainst: 0,
              }
              playerStats[radiantPlayer].peers[radiantPlayer2].played += 1
              if (listOfGames[game].winner === "Radiant") {
                playerStats[radiantPlayer].peers[radiantPlayer2].wonWith += 1
              } else {
                playerStats[radiantPlayer].peers[radiantPlayer2].lostWith += 1
              }
            } else {
              playerStats[radiantPlayer].peers[radiantPlayer2].played += 1
              if (listOfGames[game].winner === "Radiant") {
                playerStats[radiantPlayer].peers[radiantPlayer2].wonWith += 1
              } else {
                playerStats[radiantPlayer].peers[radiantPlayer2].lostWith += 1
              }
            }
          }
        }
        for (const againstDirePlayer of listOfGames[game].direPlayers) {
          if (!playerStats[radiantPlayer].peers[againstDirePlayer]) {
            playerStats[radiantPlayer].peers[againstDirePlayer] = {
              played: 1,
              wonWith: 0,
              lostWith: 0,
              wonAgainst: 0,
              lostAgainst: 0,
            }
            if (listOfGames[game].winner === "Radiant") {
              playerStats[radiantPlayer].peers[againstDirePlayer].wonAgainst += 1
            } else {
              playerStats[radiantPlayer].peers[againstDirePlayer].lostAgainst += 1
            }
          } else {
            playerStats[radiantPlayer].peers[againstDirePlayer].played += 1
            if (listOfGames[game].winner === "Radiant") {
              playerStats[radiantPlayer].peers[againstDirePlayer].wonAgainst += 1
            } else {
              playerStats[radiantPlayer].peers[againstDirePlayer].lostAgainst += 1
            }
          }
        }
      }
      for (const direPlayer of listOfGames[game].direPlayers) {
        for (const direPlayer2 of listOfGames[game].direPlayers) {
          if (direPlayer !== direPlayer2) {
            if (!playerStats[direPlayer].peers[direPlayer2]) {
              playerStats[direPlayer].peers[direPlayer2] = {
                played: 1,
                wonWith: 0,
                lostWith: 0,
                wonAgainst: 0,
                lostAgainst: 0,
              }
              if (listOfGames[game].winner === "Dire") {
                playerStats[direPlayer].peers[direPlayer2].wonWith += 1
              } else {
                playerStats[direPlayer].peers[direPlayer2].lostWith += 1
              }
            } else {
              playerStats[direPlayer].peers[direPlayer2].played += 1
              if (listOfGames[game].winner === "Dire") {
                playerStats[direPlayer].peers[direPlayer2].wonWith += 1
              } else {
                playerStats[direPlayer].peers[direPlayer2].lostWith += 1
              }
            }
          }
        }
        for (const againstRadiantPlayer of listOfGames[game].radiantPlayers) {
          if (!playerStats[direPlayer].peers[againstRadiantPlayer]) {
            playerStats[direPlayer].peers[againstRadiantPlayer] = {
              played: 1,
              wonWith: 0,
              lostWith: 0,
              wonAgainst: 0,
              lostAgainst: 0,
            }
          } else {
            playerStats[direPlayer].peers[againstRadiantPlayer].played += 1
            if (listOfGames[game].winner === "Dire") {
              playerStats[direPlayer].peers[againstRadiantPlayer].wonAgainst += 1
            } else {
              playerStats[direPlayer].peers[againstRadiantPlayer].lostAgainst += 1
            }
          }
        }
      }
    }

    return { listOfGames, playerStats, heroPicks, sideWins };
  }
}

export default readCSV;