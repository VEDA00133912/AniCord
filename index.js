require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const getRandomAnime = require('./api-data');
const axios = require('axios');

const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function sendDiscord() {
  if (!WEBHOOK_URL) {
    console.error('Webhook URL が設定されていません。');
    return;
  }

  try {
    let data = await getRandomAnime();
    if (!data || !data.title) return;

    let { tid, title } = data;
    console.log('取得したアニメ:', title, tid);

    const embed = new EmbedBuilder()
      .setTitle('**今回取得したアニメ**')
      .setDescription('ランダムに取得されたアニメの情報です！')
      .setURL('https://cal.syoboi.jp/tid/${tid}')
      .setColor('#3498db')
      .addFields(
        { name: '**タイトル**', value: title },
        { name: '**ID**', value: tid },
        { name: 'ツール制作者', value: '[Github @kozaku05](https://github.com/kozaku05/AniCord)' },
      )
      .setFooter({ text: '使用API: https://cal.syoboi.jp' });

    const body = {
      username: 'アニメ通知BOT',
      embeds: [embed.toJSON()],
    };

    await axios.post(WEBHOOK_URL, body);
  } catch (error) {
    console.error('Error in sendDiscord:', error.message);
  }
}

sendDiscord();
setInterval(sendDiscord, 600000);
