require('dotenv').config();
const { Client, MessageEmbed, Intents } = require('discord.js');
const { getPokemon, getEvolutionChain } = require('./utils/pokemon');
let PREFIX = "!";
const COMMANDS = [
	"pokemon",
	"help",
	"set-prefix"
];
// NEW: Update your intents (https://discordjs.guide/popular-topics/intents.html#error-disallowed-intents) 
// INTENTS: (https://discord.com/developers/docs/topics/gateway#list-of-intents)
const client = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.once ('ready', () =>
	console.log (`${client.user.tag} has logged in. His body is ready.`)
);

client.on('messageCreate', async message => {
	if(message.author.bot) return;
	if (message.content.indexOf(PREFIX) !== -1) {
		if(message.content.toLowerCase().startsWith(`${PREFIX}pokemon`)) {
			const pokemon = message.content.split(" ")[1].toLowerCase();
			const embed = await searchAndEmbed(pokemon);
			if (embed !== null)
				message.channel.send({embeds: [embed]});
		}
		else if(message.content.toLowerCase().startsWith(`${PREFIX}help`)) {
			const embed = help();
			message.channel.send({embeds: [embed]});
		}
		else if(message.content.toLowerCase().startsWith(`${PREFIX}set-prefix`)) {
			const splitStr = message.content.split(" ");
			if (splitStr.length == 2) {
				setPrefix(splitStr[1]);
			}
		}
	}
});

client.login (process.env.BOT_TOKEN);

async function searchAndEmbed(pokemon) {
	const pokeData = await getPokemon(pokemon);
	
	if (pokeData == null) {
		return null;
	}

	const evoData = await getEvolutionChain(pokeData.id);

	const {
		sprites,
		weight,
		name,
		id,
		types
	} = pokeData;
	const embed = new MessageEmbed();
	
	embed.setTitle(`${name} #${id}`);
	
	embed.setThumbnail(`${sprites.front_default}`);
	// stats.forEach(s => embed.addField(s.stat.name, s.base_stat, true));
	
	types.forEach(t => embed.addField('Type', t.type.name, true));
	
	embed.addField('Weight', weight.toString());
	
	if (evoData.chain !== undefined) {
		let evolvedForm = evoData.chain.evolves_to;
		let currentEvo = pokeData.name;
		while (evolvedForm !== undefined) {
			if (evolvedForm[0] !== undefined) {
				embed.addField(`${currentEvo} evolves into: `, evolvedForm[0].species.name);
				currentEvo = evolvedForm[0].species.name;
				evolvedForm = evolvedForm[0].evolves_to;
			}
			else {
				break;
			}
		}
	}
	// console.log(`${embed.title}`);
	return embed;
}

function help() {
	const embed = new MessageEmbed();
	embed.setTitle("Help Menu");
	embed.setColor(3447003);

	let commands = `${PREFIX}${COMMANDS[0]}`;
	let count = undefined;
	for (count = 1; count < COMMANDS.length; ++count) {
		const nextCommand = `\n${PREFIX}${COMMANDS[count]}`;
		commands += nextCommand;
	}
	embed.addField(`Commands: `, commands);

	return embed;
}

function setPrefix(newPrefix) {
	PREFIX = newPrefix;
}
