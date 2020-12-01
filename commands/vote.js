const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

var name = 'poll';

exports.vote = async (client, message, args) => {
	var colour_array = [
		'1211996',
		'3447003',
		'13089792',
		'16711858',
		'1088163',
		'16098851',
		'6150962'
	];
	var randomNumber = getRandomNumber(0, colour_array.length - 1);
	var randomColour = colour_array[randomNumber];

	var poll_question = args.join(' ');

	const poll_message = await message.channel.send({
		embed: {
			color: 'RANDOM',
			author: {
				name: message.author.tag,
				icon_url: message.author.avatarURL()
			},
			title: `Vote: ${poll_question}`,
			description: `リアクションを押してね！`
		}
	});

	poll_message.react('👍');
	poll_message.react('👎');

	function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};