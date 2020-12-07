// Bot will not work without my token, this is only for showing off the code


const Discord = require('discord.js'); // needed for discord, obviously
const client = new Discord.Client();
const axios = require('axios'); // needed for API calls
const prefix = '!'; // prefix for any command 
const fs = require('fs'); // needed for command file organization
const snekfetch = require('snekfetch'); // needed for reddit api

client.commands = new Discord.Collection();

// loops through all the files, and looks at the ones that end with .js
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}
// Once BeadsBot is live, he will 
client.once('ready', () =>{
    console.log('BeadsBot2 is here!');
    client.user.setActivity('!beadshelp for command list!');
});

// This is where the magic happens. This code allows me to look at the messages that start
// with the prefix and actually read them to look for commands. 

client.on('message', message=>{
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (message.author.bot || !message.content.startsWith(prefix)) return; // if the author of the message is a bot or if there's no prefix, ignore the message
    if (command === 'sucks'){ // if the command read is "!sucks", 
        client.commands.get('sucks').execute(message, args); //  execute the message in the
                                                             //  command file called 'sucks'
    }else if (command === 'greet'){ // if the command read is "!greet",
        const user = getUserFromMention(args[0]);                   // assign the the tagged user
                                                                    // to the constant 'user'
        if (!user){ // if there is no tagged user, the bot will 'reply' to whoever sent, which will tag the message author
            return message.reply(' you gotta actually mention someone.')
        }
        return message.channel.send(`Hi <@${user.id}>!`); // user.id allows us to send the message 
                                                          // and have the bot tag whoever the author tagged
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
        let getJoke = async()=>{ // async keeps the bot from crashing due to the wait time from accessing an API, using the await operator
            let response = await axios.get('https://geek-jokes.sameerkumar.website/api?format=json') // using the get command to get the joke from the api provided
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
                .query({ limit: 800 }); // only lets the bot look at a max of 800 posts
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18); // keeps nsfw posts away
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            const randomnumber = Math.floor(Math.random() * allowed.length)
            const embed = new Discord.MessageEmbed() // styling the for the embed around the message
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
	if (!mention) return; // if no mention, leave

    if (mention.startsWith('<@') && mention.endsWith('>')) { // checking to see that the tag was received properly
                                                             // the backend tag format for a mention is <@Username>
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention); // access the users in the discord client we made an get the id of who we sent in
	}
}

// Bot will not work without my token, this is only for showing off the code
client.login('');