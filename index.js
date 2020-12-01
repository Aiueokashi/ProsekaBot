const http = require('http');
http
	.createServer(function(req, res) {
		res.write('動いてりゅよฅ(＾・ω・＾ฅ)');
		res.end();
	})
	.listen(8080);
const discord = require('discord.js');
const client = new discord.Client();
const owners = require('./owner.json');
const { PREFIX } = require('./config.json');
const prefix = PREFIX;
const { ReactionController } = require('discord.js-reaction-controller');
const handleReaction = async (channelID, messageID, callback) => {
	const channel = await client.channels.fetch(channelID);
	const message = await channel.messages.fetch(messageID);
	const collector = message.createReactionCollector(() => true);
	collector.on('collect', (reaction, user) => callback(reaction, user));
};
const cron = require('node-cron');
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fetch = require('node-fetch');
var asciiFaces = require('cool-ascii-faces');
const config = require('./config.json');
const sendtime = {};

client.on('ready', async ready => {
	sendtime[client.channels.cache.get('766162642682511400')] = Date.now();
	const logchannel = client.channels.cache.get('766162642682511400');
	logchannel.send('pinging...').then(function(t) {
		t.edit(
			new discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle('再起動')
				.setDescription(
					`ping:${Date.now() -
						sendtime[client.channels.cache.get('766162642682511400')]} ms`
				)
				.setFooter(`${client.user.tag} ディレクトリ:ProsekaBot`)
		);
	});
});

client.on('ready', async ready => {
	sendtime[client.channels.cache.get('777400049893113876')] = Date.now();
	const logchannel2 = client.channels.cache.get('777400049893113876');
	logchannel2.send('pinging...').then(function(t) {
		t.edit(
			new discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle('再起動')
				.setDescription(
					`ping:${Date.now() -
						sendtime[client.channels.cache.get('777400049893113876')]} ms`
				)
				.setFooter(`${client.user.tag} ディレクトリ:ProsekaBot(本体部分)`)
		);
	});
});

client.on('message', async message => {
	if (message.content.includes(client.token)) {
		message.channel.bulkDelete(2);
	}
	const URL_PATTERN = /http(?:s)?:\/\/(?:.*)?discord(?:app)?\.com\/channels\/(?:\d{17,19})\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})/g;
	let result;

	while ((result = URL_PATTERN.exec(message.content)) !== null) {
		const group = result.groups;

		client.channels
			.fetch(group.channelId)
			.then(channel => channel.messages.fetch(group.messageId))
			.then(targetMessage => {
				if (targetMessage.attachments.size <= 0) {
					if (!targetMessage.content) {
						message.channel.send(
							new discord.MessageEmbed()
								.setColor('RANDOM')
								.setDescription(`[リンク](${message.content})`)
								.setAuthor(
									targetMessage.author.tag,
									targetMessage.author.displayAvatarURL({dynamic:true})
								)
								.setFooter(`${targetMessage.channel.name}で送信された埋め込み`)
								.setTimestamp()
						);
					} else {
						message.channel.send(
							new discord.MessageEmbed()
								.setColor('RANDOM')
								.setDescription(targetMessage.content)
								.setAuthor(
									targetMessage.author.tag,
									targetMessage.author.displayAvatarURL({dynamic:true})
								)
								.setFooter(
									`${targetMessage.channel.name}で送信された通常メッセージ`
								)
								.setTimestamp()
						);
					}
				} else {
					var targetembed = new discord.MessageEmbed()
						.setColor('RANDOM')
						.setDescription(
							`[リンク](${message.content})`
						)
            .addField('メッセージ内容:',targetMessage.content)
						.setImage(targetMessage.attachment)
						.setAuthor(
							targetMessage.author.tag,
							targetMessage.author.displayAvatarURL({dynamic:true})
						)
						.setFooter(
							`${targetMessage.channel.name}で送信されたファイル付きメッセージ`
						)
						.setTimestamp();

					message.channel.send(targetembed);
				}
			})
			.catch(error =>
				message
					.reply(error)
					.then(message => message.delete({ timeout: 10000 }))
					.catch(console.error)
			);
	}
	if (!message.content.startsWith(prefix)) return;

	const [command, ...args] = message.content.slice(prefix.length).split(' ');
	switch (command) {
		case 'test':
			message.channel.send('test');
			break;
		case 'simplepoll':
		case 'spoll':
		case 'simpoll':
			const [title, ...choices] = args;
			if (!title) return message.channel.send('タイトルを指定してください');
			const emojis = [
				'1️⃣',
				'2️⃣',
				'3️⃣',
				'4️⃣',
				'5️⃣',
				'6️⃣',
				'7️⃣',
				'8️⃣',
				'9️⃣',
				'🔟'
			];
			if (choices.length < 2 || choices.length > emojis.length)
				return message.channel.send(
					`選択肢は2から${emojis.length}の範囲で指定してください`
				);
			const poll = await message.channel.send({
				embed: {
					color: 'RANDOM',
					title: title,
					description: choices.map((c, i) => `${emojis[i]} ${c}`).join('\n')
				}
			});
			emojis.slice(0, choices.length).forEach(emoji => poll.react(emoji));
			break;

		case 'trans':
		case 'translate':
			const source = encodeURIComponent(args.shift());
			const target = encodeURIComponent(args.shift());
			const text = encodeURIComponent(args.join(' '));

			const content = await fetch(
				`https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${text}&source=${source}&target=${target}`
			).then(res => res.text());
			message.channel.send(
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('result')
					.setAuthor(message.author.tag,message.author.displayAvatarURL({dynamic:true}))
					.setDescription(content)
			);
			break;

		case 'role-info':
		case 'role-i':
			const role = message.guild.roles.cache.get(args.join(' '));
			let roleembed = new discord.MessageEmbed()
				.setColor('RANDOM')
				.setTitle('役職表示')
				.setDescription(
					`<@&${args.join(' ')}>の情報\n人数:${
						role.members.size
					}人\nポジション:${role.position}\nID:\`${args.join(' ')}\``
				)
				.setTimestamp();
			message.channel.send(roleembed);
			break;

		case 'eval':
			const { eval } = require('./commands/eval.js');
			eval(client, message, args);
			break;

		case 'vote':
		case 'v':
			const { vote } = require('./commands/vote.js');
			vote(client, message, args);
			break;

		case '協力募集':
			if (!message.channel.id === '761783096428593163') {
				message.reply('ここでは募集できないよ');
			} else if (!args[0]) {
				message.reply('ルーム番号を貼ってね(ps!協力募集 [ルーム番号])');
			} else {
				var msg = await message.channel.send(
					`<@&${'761876263165755443'}> <@${
						message.author.id
					}>が協力ライブ募集中だよ\nルーム番号:${
						args[0]
					}\n(30秒間)！(仮(今度ちゃんとした募集機能つけます))`
				);
				setTimeout(() => {
					message.delete({ timeout: 500 });
					msg.edit('募集終了');
				}, 30000);
			}
			break;

		case 'ライブ募集':
			if (!message.channel.id === '761783096428593163') {
				message.reply('ここでは募集できないよ');
			} else if (!args[0]) {
				message.reply('ルーム番号を貼ってね(ps!ライブ募集 [ルーム番号])');
			} else {
				var msg = await message.channel.send(
					`<@&${'761876162880077845'}> <@${
						message.author.id
					}>がライブ募集中だよ\nルーム番号:${
						args[0]
					}\n(30秒間)！(仮(今度ちゃんとした募集機能つけます))`
				);
				setTimeout(() => {
					message.delete({ timeout: 500 });
					msg.edit('募集終了');
				}, 30000);
			}
			break;

      case 'ベテラン募集':
			if (!message.channel.id === '761783096428593163') {
				message.reply('ここでは募集できないよ');
			} else if (!args[0]) {
				message.reply('ルーム番号を貼ってね(ps!ベテラン募集 [ルーム番号])');
			} else {
				var msg = await message.channel.send(
					`<@&${'777393145436569610'}> <@${
						message.author.id
					}>が協力募集中だよ\nルーム番号:${
						args[0]
					}\n(30秒間)！(仮(今度ちゃんとした募集機能つけます))`
				);
				setTimeout(() => {
					message.delete({ timeout: 500 });
					msg.edit('募集終了');
				}, 30000);
			}
			break;

		case 'help':
		case 'h':
			if (message.author.bot) return;
			const helpcontroller = new ReactionController(client);
			helpcontroller.addReactionHandler('❌', reaction => {
				reaction.message.delete({ timeout: 500 }).catch(console.error);
			});
			helpcontroller.addPages([
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('ヘルプ')
					.setDescription('このbotのヘルプだよ(1/3)')
					.addFields(
						{
							name: '**prefix**',
							value: 'prefixは「' + prefix + '」だよ！コマンドの前につけてね'
						},
						{
							name: '**コマンド**',
							value: '↓コマンド一覧'
						},
						{
							name: '**ps!help**',
							value: 'これ'
						},
						{
							name: '**ps!charahelp**',
							value: 'キャラヘルプ'
						},
						{
							name: '**ps!gamehelp**',
							value: 'ゲームヘルプ'
						},
						{
							name: '次ページ',
							value: 'helpの続き'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('ヘルプ')
					.setDescription('このbotのヘルプだよ(2/3)')
					.addFields(
						{
							name: '**ps!test**',
							value: 'testって返事くるよ(は？)'
						},
						{
							name: '**ps!協力募集 [ルーム番号]**',
							value: '協力募集ができるよ'
						},
						{
							name: '**ps!マルチ募集 [ルーム番号]**',
							value: 'マルチ募集ができるよ'
						},
						{
							name: '**ps!ベテラン募集 [ルーム番号]**',
							value: 'ベテランに協力募集できるよ'
						},
						{
							name: '次ページ',
							value: 'helpの続き'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('ヘルプ')
					.setDescription('このbotのヘルプだよ(3/3)')
					.addFields(
            {
							name: '**ps!chara [キャラクター名]**',
							value: 'キャラ図鑑が見れるよ(更新中)'
						},
						{
							name: '**ps!play [曲名]**',
							value: '音楽が聴けるよ(バグ多め)'
						},
						{
							name: '次ページ',
							value: '追加予定'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除')
			]);

			helpcontroller.send(message).catch(console.error);

			break;

		case 'charahelp':
		case 'charah':
			if (message.author.bot) return;
			const charahelpcontroller = new ReactionController(client);
			charahelpcontroller.addReactionHandler('❌', reaction => {
				reaction.message.delete({ timeout: 500 }).catch(console.error);
			});
			charahelpcontroller.addPages([
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('キャラヘルプ')
					.setDescription('このbotのキャラヘルプだよ(VIRTUAL SINGER)(1/6)')
					.addFields(
						{
							name: '**ps!chara miku**',
							value: '初音ミク'
						},
						{
							name: '**ps!chara rin**',
							value: '鏡音リン'
						},
						{
							name: '**ps!chara ren**',
							value: '鏡音レン'
						},
						{
							name: '**ps!chara ruka**',
							value: '巡音ルカ'
						},
						{
							name: '**ps!chara meiko**',
							value: 'MEIKO'
						},
						{
							name: '**ps!chara kaito**',
							value: 'KAITO'
						},
						{
							name: '次ページ',
							value: 'Leo/need'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('キャラヘルプ')
					.setDescription('このbotのキャラヘルプだよ(Leo/need)(2/6)')
					.addFields(
						{
							name: '**ps!chara ichika**',
							value: '星乃一歌'
						},
						{
							name: '**ps!chara saki**',
							value: '天馬咲希'
						},
						{
							name: '**ps!chara honami**',
							value: '望月穂波'
						},
						{
							name: '**ps!chara shiho**',
							value: '日野森志歩'
						},
						{
							name: '次ページ',
							value: 'MORE MORE JUMP'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('キャラヘルプ')
					.setDescription('このbotのキャラヘルプだよ(MORE MORE JUMP)(3/6)')
					.addFields(
						{
							name: '**ps!chara minori**',
							value: '花里みのり'
						},
						{
							name: '**ps!chara haruka**',
							value: '桐谷遥'
						},
						{
							name: '**ps!chara airi**',
							value: '桃井愛莉'
						},
						{
							name: '**ps!chara shizuku**',
							value: '日野森雫'
						},
						{
							name: '次ページ',
							value: 'Vivid BAD SQUAD'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('キャラヘルプ')
					.setDescription('このbotのキャラヘルプだよ(Vivid BAD SQUAD)(4/6)')
					.addFields(
						{
							name: '**ps!chara kohane**',
							value: '小豆沢こはね'
						},
						{
							name: '**ps!chara ann**',
							value: '白石杏'
						},
						{
							name: '**ps!chara akito**',
							value: '東雲彰人'
						},
						{
							name: '**ps!chara touya**',
							value: '青柳冬弥'
						},
						{
							name: '次ページ',
							value: 'ワンダーランズ×ショウタイム'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('キャラヘルプ')
					.setDescription(
						'このbotのキャラヘルプだよ(ワンダーランズ×ショウタイム)(5/6)'
					)
					.addFields(
						{
							name: '**ps!chara tsukasa**',
							value: '天馬司'
						},
						{
							name: '**ps!chara rui**',
							value: '神代類'
						},
						{
							name: '**ps!chara nene**',
							value: '草薙寧々'
						},
						{
							name: '**ps!chara emu**',
							value: '鳳えむ'
						},
						{
							name: '次ページ',
							value: '25時、ナイトコードで。'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('キャラヘルプ')
					.setDescription(
						'このbotのキャラヘルプだよ(25時、ナイトコードで。)(5/6)'
					)
					.addFields(
						{
							name: '**ps!chara kanade**',
							value: '宵崎奏'
						},
						{
							name: '**ps!chara mizuki**',
							value: '暁山瑞希'
						},
						{
							name: '**ps!chara ena**',
							value: '東雲絵名'
						},
						{
							name: '**ps!chara mahuyu**',
							value: '朝比奈まふゆ'
						},
						{
							name: '次ページ',
							value: '制作中'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除')
			]);

			charahelpcontroller.send(message).catch(console.error);

			break;

		case 'gamehelp':
		case 'gameh':
			if (message.author.bot) return;
			const gamehelpcontroller = new ReactionController(client);
			gamehelpcontroller.addReactionHandler('❌', reaction => {
				reaction.message.delete({ timeout: 500 }).catch(console.error);
			});
			gamehelpcontroller.addPages([
				new discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('ヘルプ')
					.setDescription('このbotのゲームヘルプだよ')
					.addFields(
						{
							name: '**ゲーム一覧**',
							value:
								'ブラックジャック(ps!blackjack)\n~~ルーレット(ps!roulette)~~\nスロット(ps!slot)'
						},
						{
							name: '**その他コマンド**',
							value: 'コイン確認(ps!coin)\nコインランキング(ps!coinranking)'
						},
						{
							name: '次ページ',
							value: '追加予定'
						}
					)
					.setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除')
			]);

			gamehelpcontroller.send(message).catch(console.error);

			break;

		case 'chara':
		case 'c':
			if (!args[0]) {
				message.channel.send('キャラクター名を入力してね');
			}
			switch (args[0]) {
				case 'miku':
					let embed = new discord.MessageEmbed()
						.setColor('#03fcdf')
						.setTitle('初音ミク')
						.setDescription(
							'ブルーグリーンのツインテールが特徴的な少女バーチャル・シンガー。ハツラツとした明るく可愛い歌声で様々なジャンルの歌を歌う。バーチャル・シンガーの中でも、世代を問わず世界的に名前が知られている。\nhttps://youtu.be/JUYva672FBw'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/virtualsinger/chara_01.png'
						)
						.setImage(
							'https://www.4gamer.net/games/476/G047609/20200417029/TN/001.jpg'
						)
						.addField('誕生日', '8/31')
						.addField('身長', '158cm');
					message.channel.send(embed);
					break;

				case 'rin':
					let rin = new discord.MessageEmbed()
						.setColor('#ffed00')
						.setTitle('鏡音リン')
						.setDescription(
							'大きなリボンを着けたブロンドボブヘアが特徴的な少女バーチャル・シンガー。鏡音レンとはツイン・ボーカル。キュートで元気な見た目にぴったりな、チャーミングな歌声を持っている。\nhttps://youtu.be/O7EwFDh49jI%22'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/virtualsinger/chara_02.png'
						)
						.setImage(
							'https://www.4gamer.net/games/476/G047609/20200417029/TN/001.jpg'
						)
						.addField('誕生日', '12/27')
						.addField('身長', '152cm');
					message.channel.send(rin);
					break;

				case 'ren':
					let embed1 = new discord.MessageEmbed()
						.setColor('#ffed00')
						.setTitle('鏡音レン')
						.setDescription(
							'短く後ろに結ばれたブロンドヘアが特徴的な少年バーチャル・シンガー。鏡音リンとはツイン・ボーカル。少年らしい芯のあるパワフルな歌声の中に感情表現の豊かさもかね備えている。\nhttps://www.youtube.com/watch?v=N0G7sowZ3ZA'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/virtualsinger/chara_03.png'
						)
						.setImage(
							'https://www.4gamer.net/games/476/G047609/20200417029/TN/001.jpg'
						)
						.addField('誕生日', '12/27')
						.addField('身長', '156cm');
					message.channel.send(embed1);
					break;

				case 'ruka':
					let embed2 = new discord.MessageEmbed()
						.setColor('#ff1493')
						.setTitle('巡音ルカ')
						.setDescription(
							'ピンクのロングヘアが特徴的な女性バーチャル・シンガー。落ちついた物腰によく合う柔らかい歌声を持つ一方、時には情熱的な歌声を聴かせることも。バイリンガルで、日本語と英語で歌うことができる。\nhttps://www.youtube.com/watch?v=lngNfCqjCOA'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/virtualsinger/chara_04.png'
						)
						.setImage(
							'https://www.4gamer.net/games/476/G047609/20200417029/TN/001.jpg'
						)
						.addField('誕生日', '1/30')
						.addField('身長', '162cm');
					message.channel.send(embed2);
					break;

				case 'meiko':
					let embed3 = new discord.MessageEmbed()
						.setColor('RED')
						.setTitle('MEIKO')
						.setDescription(
							'栗色のショートボブと、赤いショート丈のトップスとミニスカートが特徴的な女性バーチャル・シンガー。安定感のある抜群の歌唱力と、女性ならではの優しく温かみのある声質を持っている。\nhttps://www.youtube.com/watch?v=5fDWSTp_HXU'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/virtualsinger/chara_05.png'
						)
						.setImage(
							'https://www.4gamer.net/games/476/G047609/20200417029/TN/001.jpg'
						)
						.addField('誕生日', '11/5')
						.addField('身長', '167cm');
					message.channel.send(embed3);
					break;

				case 'kaito':
					let embed4 = new discord.MessageEmbed()
						.setColor('BLUE')
						.setTitle('KAITO')
						.setDescription(
							'若干外ハネしたダークブルーの髪と、青いロングマフラーの衣装が特徴的な男性バーチャル・シンガー。清涼感のある素直な歌声で、男性らしい厚みのある低音から伸びのある高音まで歌いわける。\nhttps://youtu.be/uZMWMm01vjI'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/virtualsinger/chara_06.png'
						)
						.setImage(
							'https://www.4gamer.net/games/476/G047609/20200417029/TN/001.jpg'
						)
						.addField('誕生日', '2/17')
						.addField('身長', '175cm');
					message.channel.send(embed4);
					break;

				case 'ichika':
					let embed5 = new discord.MessageEmbed()
						.setColor('#b0c4de')
						.setTitle('星乃一歌')
						.setDescription(
							'クールに見えて、本当は友人想いの優しい少女。咲希、穂波、志歩とは幼馴染みだが、ある事情から穂波と志歩とは関係がぎくしゃくしている。ミクの歌を聴くことが好き。Leo/needではギターとボーカル担当。\nhttps://youtu.be/SXjKFi2WgNU'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite01/chara_01.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/le6CyT6n.jpg'
						)
						.addField('誕生日', '8/11')
						.addField('身長', '161cm');
					message.channel.send(embed5);
					break;

				case 'saki':
					let embed6 = new discord.MessageEmbed()
						.setColor('#ffdf00')
						.setTitle('天馬咲希')
						.setDescription(
							'Leo/needではキーボード担当で、いつも明るく笑顔を絶やさないムードメーカー。生まれつき病弱だったせいで中学校からはなかなか通えなかったが、ようやく元気になり高校から復学する。久しぶりに再会できる幼馴染たちと楽しい高校生活をきたいしていたが....。\nhttps://youtu.be/2EqLngtPiMI'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite01/chara_02.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/le6CyT6n.jpg'
						)
						.addField('誕生日', '5/9')
						.addField('身長', '159cm');
					message.channel.send(embed6);
					break;

				case 'honami':
					let embed7 = new discord.MessageEmbed()
						.setColor('#ff422c')
						.setTitle('望月穂波')
						.setDescription(
							'Leo/needではドラムを担当している。文武両道の優等生で包み込むような優しさを持つ。一歌、咲希、志歩とは幼馴染だったが、中学時代のあることがきっかけで一歌たちとは距離を置くようになってしまった。\nhttps://youtu.be/IuCucdJaIrQ'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite01/chara_03.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/le6CyT6n.jpg'
						)
						.addField('誕生日', '10/27')
						.addField('身長', '166cm');
					message.channel.send(embed7);
					break;

				case 'shiho':
					let embed8 = new discord.MessageEmbed()
						.setColor('#36b028')
						.setTitle('日野森志歩')
						.setDescription(
							'Leo/needではベース担当の馴れ合いを嫌う一匹狼。自分の好きなことに没頭し、周囲の人間にどう思われようが気にしない。そんな彼女もかつては幼馴染たちと行動を共にしており、友人たちのことも大切に思っていたのだが....。\nhttps://youtu.be/t4WE_92Xjgw'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite01/chara_04.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/le6CyT6n.jpg'
						)
						.addField('誕生日', '1/8')
						.addField('身長', '159cm');
					message.channel.send(embed8);
					break;

				case 'minori':
					let embed9 = new discord.MessageEmbed()
						.setColor('#ffcf90')
						.setTitle('花里みのり')
						.setDescription(
							'純粋でひたむきな頑張り屋。アイドルグループ「ASRUN」の桐谷遥を目にしてからアイドルを目指すようになった。様々なオーディションを受けるが、落ち続けている。\nhttps://youtu.be/clzRL_0M-zw'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite02/chara_01.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/GSkyhE5A.jpg'
						)
						.addField('誕生日', '4/14')
						.addField('身長', '158cm');
					message.channel.send(embed9);
					break;

				case 'haruka':
					let embed10 = new discord.MessageEmbed()
						.setColor('#41a8ff')
						.setTitle('桐谷遥')
						.setDescription(
							'国民的人気アイドルグループ「ASRUN」に所属。カリスマ的な存在で、グループ内でも絶大な人気を誇っていた。だが、グループの解放を機に芸能界を引退し、みのりが通う宮益坂女子学園に復学する。\nhttps://youtu.be/MXLwDOUIAAI'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite02/chara_02.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/GSkyhE5A.jpg'
						)
						.addField('誕生日', '10/5')
						.addField('身長', '163cm');
					message.channel.send(embed10);
					break;

				case 'airi':
					let embed11 = new discord.MessageEmbed()
						.setColor('#ff41b8')
						.setTitle('桃井愛莉')
						.setDescription(
							'バラエティ番組などに出演し、かつて人気を博していた元アイドル。自信家で強引な面もあるが、アイドルの仕事に愛と情熱と強い誇りを持っていた。今ではある事情から事務所を辞め、アイドルも引退してしまっている。\nhttps://youtu.be/93v55ISzkKY'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite02/chara_03.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/GSkyhE5A.jpg'
						)
						.addField('誕生日', '3/19')
						.addField('身長', '156cm');
					message.channel.send(embed11);
					break;

				case 'shizuku':
					let embed12 = new discord.MessageEmbed()
						.setColor('#58eaff')
						.setTitle('日野森雫')
						.setDescription(
							'人気アイドルグループ「Cheerful＊Days」に所属している現役アイドル。ミステリアスな大人の魅力を感じさせる容姿でファンを虜にしている。しかし、グループの仲間からは妬まれることも。愛莉とは研究生時代の同期。\nhttps://youtu.be/PdKVjnJ8bH0'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite02/chara_04.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/GSkyhE5A.jpg'
						)
						.addField('誕生日', '12/6')
						.addField('身長', '168cm');
					message.channel.send(embed12);
					break;

				case 'kohane':
					let embed13 = new discord.MessageEmbed()
						.setColor('#ff3ebe')
						.setTitle('小豆沢こはね')
						.setDescription(
							'とても内気で自分に自信がない少女。ある日偶然通りかかったライブカフェ&バーで杏とミュージシャンがセッションしているのを目撃。学校の音楽では聴いたことも見たこともない。ラップや激しいテンポの音楽に衝撃を受け、虜になってしまう。\nhttps://youtu.be/faXqIooFi3o'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite03/chara_01.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/kSlNuB0N.jpg'
						)
						.addField('誕生日', '3/2')
						.addField('身長', '156cm');
					message.channel.send(embed13);
					break;

				case 'ann':
					let embed14 = new discord.MessageEmbed()
						.setColor('#34bfcb')
						.setTitle('白石杏')
						.setDescription(
							'サバサバとした勝気な性格。父は元ミュージシャンでシブヤのストリートではかなり有名。そんな父がかつて行ったライブイベント「RAD WEEKEND」をこえる最高のイベントを自分の手で作ることを夢見ている。\nhttps://youtu.be/cnDAppnvygQ'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite03/chara_02.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/kSlNuB0N.jpg'
						)
						.addField('誕生日', '7/26')
						.addField('身長', '160cm');
					message.channel.send(embed14);
					break;

				case 'akito':
					let embed15 = new discord.MessageEmbed()
						.setColor('#ffbd00')
						.setTitle('東雲彰人')
						.setDescription(
							'杏の父に憧れて中学時代から音楽活動をしている。相棒の冬弥とは「BAD DOGS」という名前でイベントハウスなどで歌っている。一見人当たりが良さそうに見えるのだが....。\nhttps://youtu.be/Apbdjkl8izY'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite03/chara_04.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/kSlNuB0N.jpg'
						)
						.addField('誕生日', '11/12')
						.addField('身長', '174cm');
					message.channel.send(embed15);
					break;

				case 'touya':
					let embed16 = new discord.MessageEmbed()
						.setColor('#54ooff')
						.setTitle('青柳冬弥')
						.setDescription(
							'クールで無口。クラシック音楽に携わる厳格な父がおり、幼少期から英才教育を受けていたため、音楽センスは抜群。だが、父に嫌気がさして路上での音楽活動を始めた。\nhttps://youtu.be/hYWWIeR6WRQ'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite03/chara_03.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/kSlNuB0N.jpg'
						)
						.addField('誕生日', '5/25')
						.addField('身長', '178cm');
					message.channel.send(embed16);
					break;

				case 'tsukasa':
					let embed17 = new discord.MessageEmbed()
						.setColor('#ffa400')
						.setTitle('天馬司')
						.setDescription(
							'自信過剰な目立ちたがり屋。調子に乗りやすく、また乗せられやすい。子供の頃に見た劇団のショーに憧れ、世界一のスターを目指している。病弱な妹・咲希を励まし、兄として頼れる一面も見せる。\nhttps://youtu.be/krkqjGfAaAY'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite04/chara_04.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/cQYCCNUo.jpg'
						)
						.addField('誕生日', '5/17')
						.addField('身長', '172cm');
					message.channel.send(embed17);
					break;

				case 'emu':
					let embed18 = new discord.MessageEmbed()
						.setColor('#ff74d1')
						.setTitle('鳳えむ')
						.setDescription(
							'底抜けに明るい天真爛漫な性格。思い立ったら即アクションを起こしてしまうため、いつのまにか周囲を巻き込むこともしばしば。フェニックスワンダーランドのさびれたステージをどうにか復活させようと、一緒にステージに立ってくれる人を探している。\nhttps://youtu.be/UZ5danfxYLQ'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite04/chara_05.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/cQYCCNUo.jpg'
						)
						.addField('誕生日', '9/9')
						.addField('身長', '152cm');
					message.channel.send(embed18);
					break;

				case 'nene':
					let embed19 = new discord.MessageEmbed()
						.setColor('#4eff9b')
						.setTitle('草薙寧々')
						.setDescription(
							'類の推薦でメンバーに加わることになった毒舌少女。ミュージカルの舞台を夢見ているその歌声はとても高校生は思えないレベル。しかし、なぜか司やえむの前には姿を現さず、ネネロボというロボを操作し、自分の代わりにステージに立たせている。\nhttps://youtu.be/HMDEx7gAd50'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite04/chara_03.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/cQYCCNUo.jpg'
						)
						.addField('誕生日', '7/20')
						.addField('身長', '156cm');
					message.channel.send(embed19);
					break;

				case 'rui':
					let embed20 = new discord.MessageEmbed()
						.setColor('#b55fff')
						.setTitle('神代類')
						.setDescription(
							'マイペースな天才。寧々とは家も隣同士で幼馴染み。ステージの演出を手掛ける一方で、得意な機械いじりや発明を活かしてショー用のロボットを作っている。独特の発想をするためには周囲から変人扱いされることが多い。\nhttps://youtu.be/eIC3eUtpRGk'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite04/chara_02.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1609/entry/cQYCCNUo.jpg'
						)
						.addField('誕生日', '6/24')
						.addField('身長', '180cm');
					message.channel.send(embed20);
					break;

				case 'kanade':
					let embed21 = new discord.MessageEmbed()
						.setColor('#a94b6a')
						.setTitle('宵崎奏')
						.setDescription(
							'自分の音楽が大切な人を絶望させてしまったトラウマを持つ。その経験から「誰かを幸せにする曲を作り続けなければならない」と考えるようになり、「25時、ナイトコードで。」を結成。主に作曲を担当している。\nhttps://youtu.be/7L6sogVi7Oc'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite05/chara_05.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1571/entry/RFJY2w8f.jpg'
						)
						.addField('誕生日', '2/10')
						.addField('身長', '154cm');
					message.channel.send(embed21);
					break;

				case 'mahuyu':
					let embed22 = new discord.MessageEmbed()
						.setColor('#6f60be')
						.setTitle('朝比奈まふゆ')
						.setDescription(
							'明るくユーモアもあり。誰からも頼られる優等生。サークルメンバーの中で唯一学校にも普通に通っている。サークル活動の中でも、作詞を担当しながら様々な気遣いを見せる。一見、完璧な優等生に見えるが....？\nhttps://youtu.be/tIqXODldSzk'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite05/chara_04.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1571/entry/RFJY2w8f.jpg'
						)
						.addField('誕生日', '1/27')
						.addField('身長', '162cm');
					message.channel.send(embed22);
					break;

				case 'ena':
					let embed23 = new discord.MessageEmbed()
						.setColor('#c09f81')
						.setTitle('東雲絵名')
						.setDescription(
							'承認されたいという気持ちが強く、SNS依存気味。父親は有名な画家で自身も絵を描いて投稿していた。それを見つけた奏でに声をかけられメンバーに。サークルでは主に動画用のイラストを担当している。\nhttps://youtu.be/brNwXh3pcBs'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite05/chara_03.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1571/entry/RFJY2w8f.jpg'
						)
						.addField('誕生日', '4/30')
						.addField('身長', '158cm');
					message.channel.send(embed23);
					break;

				case 'mizuki':
					let embed24 = new discord.MessageEmbed()
						.setColor('#d09dc6')
						.setTitle('暁山瑞希')
						.setDescription(
							'可愛いものが大好きな気分屋。たまたま聴いた奏の曲に惹かれるものを感じ、MVを作って投稿する。其れがかなで自身の目に留まり、動画担当として誘われた。サークルメンバーのだれも知らない秘密がある。\nhttps://youtu.be/sDmFO7IPKZI'
						)
						.setThumbnail(
							'https://pjsekai.sega.jp/assets/images/character/unite05/chara_02.png'
						)
						.setImage(
							'https://cdn.gamerch.com/contents/wiki/1571/entry/RFJY2w8f.jpg'
						)
						.addField('誕生日', '8/27')
						.addField('身長', '163cm');
					message.channel.send(embed24);
					break;
				//-------------------------------↓こっからしたレア度別
				case 'ohirome-miku':
					const controller = new ReactionController(client);
					controller.addPages([
						new discord.MessageEmbed()
							.setColor('#03fcdf')
							.setTitle('初音ミク(◀:前ページ/▶:次ページ)(1/2)')
							.setDescription(
								'ブルーグリーンのツインテールが特徴的な少女バーチャル・シンガー。ハツラツとした明るく可愛い歌声で様々なジャンルの歌を歌う。バーチャル・シンガーの中でも、世代を問わず世界的に名前が知られている。'
							)
							.setImage(
								'https://cdn.gamerch.com/contents/wiki/1571/entry/LxR5kdTG.png'
							)
							.setThumbnail(
								'https://pjsekai.sega.jp/assets/images/character/unite02/logo_group01.png'
							)
							.addField('最大レベル', 'lv.50')
							.addField('最大時ステータス', '総合力:31746')
							.addField(
								'スキル:さあ、ステージへ！',
								'5秒間、スコアが120%UPする。'
							)
							.addField('サブユニット', 'MORE MORE JUMP!'),
						new discord.MessageEmbed()
							.setColor('#03fcdf')
							.setTitle('初音ミク(◀:前ページ/▶:次ページ)(2/2)')
							.setDescription(
								'ブルーグリーンのツインテールが特徴的な少女バーチャル・シンガー。ハツラツとした明るく可愛い歌声で様々なジャンルの歌を歌う。バーチャル・シンガーの中でも、世代を問わず世界的に名前が知られている。'
							)
							.setImage(
								'https://appmedia.jp/wp-content/uploads/2020/09/f63f47cb2dd6ec79a1d7dfad131addec.jpg'
							)
							.setThumbnail(
								'https://pjsekai.sega.jp/assets/images/character/unite02/logo_group01.png'
							)
							.addField('最大レベル', 'lv.60')
							.addField('最大時ステータス', '総合力:31746')
							.addField(
								'スキル:さあ、ステージへ！',
								'5秒間、スコアが120%UPする。'
							)
							.addField('サブユニット', 'MORE MORE JUMP!')
					]);
					controller.send(message);
					break;
			}
			break;
		//-------------------------------曲
		//-------------------------------曲
		//-------------------------------曲

		case 'music':
		case 'm':
			if (!args[0]) {
				message.channel.send('曲名を入力してね');
			}
			switch (args[0]) {
				case 'Untitled':
				case 'untitled':
					let embed = new discord.MessageEmbed()
						.setColor('BLACK')
						.setTitle('Untitled')
						.setDescription(
							'強い想いを持つ少年少女のデバイスに突如生じるメロディも歌詞もない無音の楽曲「Untitled（ アンタイトル）」再生することで「セカイ」と行き来ができる。\n自分たちの本当の想いを見つけ出すことで「Untitled」に名前がつき、歌が生まれる。'
						)
						.setThumbnail(
							'https://repl.it/@Proseka/ProsekaBot#assets/Black.jpeg'
						)
						.addField('作詞', 'unknown')
						.addField('作曲', 'unknown')
						.addField('編曲', 'unknown');
					message.channel.send(embed);
					break;

				case 'セカイ':
					let embed1 = new discord.MessageEmbed()
						.setColor('WHITE')
						.setTitle('セカイ')
						.setDescription(
							'[セカイ](https://www.youtube.com/watch?v=9vyIPWBeRes&vl=ja)'
						)
						.setThumbnail('./assets/Sekai.jpeg')
						.addField('作詞', 'DECO*27')
						.addField('作曲', '堀江晶太(kemu)')
						.addField('編曲', '-')
						.addField('演奏時間:', '1:50', true)
						.addField('EASY:6', 'ノーツ:143', true)
						.addField('NORMAL:12', 'ノーツ:400', true)
						.addField('HARD:18', 'ノーツ:549', true)
						.addField('EXPERT:23', 'ノーツ:735', true)
						.addField('MASTER:26', 'ノーツ:858', true);
					message.channel.send(embed1);
					break;

				case 'ワーワーワールド':
					let embed2 = new discord.MessageEmbed()
						.setColor('BLUE')
						.setTitle('ワーワーワールド')
						.setDescription(
							'[ワーワーワールド](https://www.youtube.com/watch?v=okJ9Vk6owG8&vl=ja)'
						)
						.setThumbnail('./assets/Wah-world.jpeg')
						.addField('作詞', 'Mitchie M')
						.addField('作曲', 'Giga & Mitchie M')
						.addField('編曲', 'Rockwell')
						.addField('演奏時間:', '1:47', true)
						.addField('EASY:7', 'ノーツ:127', true)
						.addField('NORMAL:12', 'ノーツ:343', true)
						.addField('HARD:17', 'ノーツ:519', true)
						.addField('EXPERT:24', 'ノーツ:789', true)
						.addField('MASTER:28', 'ノーツ:960', true);
					message.channel.send(embed2);
					break;

				case 'needLe':
					let embed3 = new discord.MessageEmbed()
						.setColor('GREEN')
						.setTitle('needLe')
						.setDescription(
							'[needLe](https://www.youtube.com/watch?v=buoYwfZG4vQ)'
						)
						.setThumbnail(
							'https://repl.it/@Proseka/ProsekaBot#assets/needLe.jpeg'
						)
						.addField('作詞', 'DECO*27', true)
						.addField('作曲', 'DECO*27', true)
						.addField('編曲', 'Rockwell')
						.addField('演奏時間:', '1:56', true)
						.addField('EASY:7', 'ノーツ:216', true)
						.addField('NORMAL:12', 'ノーツ:430', true)
						.addField('HARD:17', 'ノーツ:662', true)
						.addField('EXPERT:25', 'ノーツ:889', true)
						.addField('MASTER:29', 'ノーツ:1029', true);
					message.channel.send(embed3);
					break;

				case 'アイドル親衛隊':
					let embed4 = new discord.MessageEmbed()
						.setColor('アイドル親衛隊')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed4);
					break;

				case 'Ready Steady':
					let embed5 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed5);
					break;

				case 'セカイはまだ始まってすらいない':
					let embed6 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed6);
					break;

				case '悔やむと書いてミライ':
					let embed8 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed8);
					break;

				case 'Tell Your World':
					let embed9 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed9);
					break;

				case 'ロキ':
					let embed10 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed10);
					break;

				case 'ヒバナ':
					let embed11 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed11);
					break;

				case '劣等上等':
					let embed12 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed12);
					break;

				case 'アスノヨゾラ哨戒班':
					let embed13 = new discord.MessageEmbed()
						.setColor('covercolor')
						.setTitle('name')
						.setDescription(
							'description\nyoutubelink(プロセカのホームページにある)'
						)
						.setThumbnail('thumbnail(いらないかも？)')
						.setImage('Image')
						.addField('作詞', 'name')
						.addField('作曲', 'name')
						.addField('編曲', 'name');
					message.channel.send(embed13);
					break;
			}
	}
});

client.login(process.env.token);
