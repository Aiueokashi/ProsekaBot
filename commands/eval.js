const discord = require('discord.js');
const client = new discord.Client();
const { inspect } = require('util');
const owners = require('./../owner.json');

exports.eval = async function(client, message, args) {
	if (owners.includes(message.author.id)) {
		let evaled;
		var sourceStr = message.content;
		var code = sourceStr.slice(5);
		try {
			evaled = await eval(args.join(' '));
			message.react('✅');
			console.log(inspect(evaled));
		} catch (error) {
			console.error(error);
			message.channel.send({
				embed: {
					color: 0x00ae86,
					title: 'ERROR',
					description: 'コード```' + code + '```ERROR内容```' + error + '```'
				}
			});
			message.react('❎');
		}
	} else {
		console.log(`${message.author.name}がevalを使ったよ`);
	}
};
