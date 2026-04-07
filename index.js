const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers, // Required for welcome messages
  ],
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`Bot is live as ${client.user.tag}!`);
});

// 1. Welcome Message
client.on('guildMemberAdd', (member) => {
  const channel = member.guild.systemChannel; // Sends to the default system channel
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}! Glad you're here.`);
});

// 2. Commands (Ping & Clear)
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // !ping command
  if (command === 'ping') {
    message.reply('🏓 Pong!');
  }

  // !clear [number] command
  if (command === 'clear') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You don't have permission to delete messages!");
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('Please provide a number between 1 and 100.');
    }

    await message.channel.bulkDelete(amount + 1, true);
    message.channel.send(`Deleted ${amount} messages.`).then(msg => {
      setTimeout(() => msg.delete(), 3000); // Deletes the bot's confirmation after 3 seconds
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
