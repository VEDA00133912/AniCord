const axios = require('axios');
const xml2js = require('xml2js');

async function getRandomAnime() {
  try {
    let data = await axios.get(
      'https://cal.syoboi.jp/db.php?Command=TitleLookup&Fields=TID,Title,Cat'
    );

    return new Promise((resolve, reject) => {
      xml2js.parseString(data.data, (err, result) => {
        if (err) {
          return reject('Error parsing XML: ' + err.message);
        }

        const titleItems =
          result.TitleLookupResponse.TitleItems?.[0]?.TitleItem;
        if (titleItems && titleItems.length > 0) {
          const randomIndex = Math.floor(Math.random() * titleItems.length);
          const item = titleItems[randomIndex];
          const tid = item.TID?.[0];
          const title = item.Title?.[0];

          resolve({ tid, title });
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

module.exports = getRandomAnime;
