import { readString } from 'react-papaparse'

const readCSV = async () => {
  const response = await fetch('https://raw.githubusercontent.com/lixuanle/dota-inhouse-stats/main/public/data/game-stats.csv');
  const data = await response.text();
  const { data: csvData } = readString(data);
  if (csvData.length > 0) {
    let listOfGames = {};
    let gameNum = 0;
    let playerStats = {};
    for (const row of csvData.slice(1)) {
      if (row[0].length > 0) {
        gameNum = row[0];
        listOfGames[gameNum] = {
          "radiant": {},
          "dire": {},
        };
      }
      if (row[1] !== "Winner: ") {
        const radiantPlayer = row[1];
        const direPlayer = row[7];
        console.log(direPlayer);
        if (!playerStats[radiantPlayer]) {
          playerStats[radiantPlayer] = {
            heroesPlayed: {},
            kills: 0,
            deaths: 0,
            assists: 0,
            wins: 0,
          }
        }
        playerStats[radiantPlayer].kills += parseInt(row[2]);
        playerStats[radiantPlayer].deaths += parseInt(row[3]);
        playerStats[radiantPlayer].assists += parseInt(row[4]);
        playerStats[radiantPlayer].damage += parseInt(row[6]);
        playerStats[radiantPlayer].wins += (row[11] === radiantPlayer ? 1 : 0);
        // playerStats[radiantPlayer] = {
        //   kills: this.kills+=parseInt(row[2]),
        //   deaths: this.deaths+=parseInt(row[3]),
        //   assists: this.assists+=parseInt(row[4]),
        //   damage: this.damage+=parseInt(row[5]),
        //   wins: row[11] === radiantPlayer ? this.wins+=1 : this.wins,
        // }
        // playerStats[direPlayer] = {
        //   kills: this.kills > 0 ? this.kills+=row[7] : 0,
        //   deaths: this.deaths > 0 ? this.deaths+=row[8] : 0,
        //   assists: this.assists > 0 ? this.assists+=row[9] : 0,
        //   damage: this.damage > 0 ? this.damage+=row[10] : 0,
        //   wins: this.wins > 0 && row[11] === direPlayer ? this.wins+=1 : 0,
        // }
        listOfGames[gameNum].radiant[radiantPlayer] = {
          kills: row[2],
          deaths: row[3],
          assists: row[4],
          hero: row[5],
          damage: row[6],
          winner: row[11] === radiantPlayer ? true : false
        };
        listOfGames[gameNum].dire[direPlayer] = {
          kills: row[8],
          deaths: row[9],
          assists: row[10],
          damage: row[11],
          winner: row[12] === direPlayer ? true : false
        };
      }
    }
    return { listOfGames, playerStats };
  }
}

export default readCSV;