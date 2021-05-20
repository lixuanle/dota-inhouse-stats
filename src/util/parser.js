const readCSV = () => {
  return fetch('https://raw.githubusercontent.com/lixuanle/10man-stats/master/game-stats.csv?token=AJAGMNIJY6F3HAXIC45DYT3AUXCY2')
    .then(response => {
      return response.text();
    })
  return true
}

export default readCSV;