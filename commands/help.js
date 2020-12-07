module.exports ={
    name: 'help',
    description: 'Shows command list',
    execute(message, args){
        const Discord = require('discord.js');
        const embed = new Discord.MessageEmbed()
        .setColor(0x00A2E8)
        .setTitle('BeadsBot\'s Command List!')
        .addField('!joke', 'Will send you a nerdy joke (often returns a Chuck Norris joke, don\'t ask why)')
        .addField('!meme', ' Will send you a meme from r/ProgrammerHumor')
        .addField('!sucks', 'Use this to tell someone that it \"Sucks to suck.\" (because it often does)')
        .addField('!rough', 'Will send the \"That\'s rough buddy\" gif')
        .addField('!taps', 'Plays taps for our fallen brother')
        .addField('!greet + User Tag', 'Will greet someone for you!')
        message.channel.send(embed);
    }
}