const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const prefix = '!';
const fs = require('fs');
const snekfetch = require('snekfetch');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () =>{
    console.log('BeadsBot2 is here!');
    client.user.setActivity('!beadshelp for command list!');
});

client.on('message', message=>{
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    if (command === 'sucks'){
        client.commands.get('sucks').execute(message, args);
    }else if (command === 'greet'){
        const user = getUserFromMention(args[0]);
        if (!user){
            return message.reply(' you gotta actually mention someone.')
        }
        return message.channel.send(`Hi <@${user.id}>!`);
    }else if (command === 'rough'){
        client.commands.get('rough').execute(message, args);
    }else if (command === 'taps'){
        client.commands.get('taps').execute(message, args);
    }else if (command === 'beadshelp'){
        client.commands.get('help').execute(message, args);
    }
});

client.on('message', async message =>{
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (message.author.bot) return;

    if (command === 'joke') {
        let getJoke = async()=>{
            let response = await axios.get('https://geek-jokes.sameerkumar.website/api?format=json')
            let joke = response.data
            return joke
        }

        let jokeValue = await getJoke();
//        console.log(jokeValue);
        message.reply(`Here's a joke I thought of earlier: \n ${jokeValue.joke}`)

    }
});

client.on('message', async message =>{
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (message.author.bot) return;

    if (command === 'meme') {
        try {
            const { body } = await snekfetch
                .get('https://www.reddit.com/r/programmerhumor.json?sort=top&t=week')
                .query({ limit: 800 });
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            const randomnumber = Math.floor(Math.random() * allowed.length)
            const embed = new Discord.MessageEmbed()
            .setColor(0x00A2E8)
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
            .setFooter("Memes provided by r/ProgrammerHumor")
            message.channel.send(embed)
        } catch (err) {
            return console.log(err);
        }

    }
    
});

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}


client.login('Nzg1MzUxMTcxMTQ0OTQxNjE4.X82lRg._mBtxZiN_1WSqrJe-U_XgWsiGvo');