const fs = require('node:fs');
const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');

client = new Client({ intents: 33282, presence: { status: 'idle' }});
client.db = require('./Util/database')

client.commands = new Collection();
const commandFolders = fs.readdirSync(`${__dirname}/commands`);

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`${__dirname}/commands/${folder}`).filter(file => file.endsWith(".js"));
  console.log(`Next commands are loading from "${folder}"`);

  for (const file of commandFiles) {
   try {
      const command = require(`${__dirname}/commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
      console.log(`Command "${command.data.name}" has been loaded`);
   } catch (err) {
      console.error(err);
    }
  }
}

console.log("All command have been loaded");

client.messages = new Collection();
const messageFolders = fs.readdirSync(`${__dirname}/messages`);

for (const folder of messageFolders) {
  const messagesFiles = fs.readdirSync(`${__dirname}/messages/${folder}`).filter(file => file.endsWith(".js"));
  console.log(`Next messages are loading from "${folder}"`)

  for (const file of messagesFiles) {
   try {
      const message = require(`${__dirname}/messages/${folder}/${file}`);
      client.messages.set(message.message, message);
      console.log(`Message "${message.message}" has been loaded`);
   } catch (err) {
      console.error(err);
    }
  }
}

console.log("All message has been loaded");

client.once('ready', () => {
  client.db.Cases.sync();
  console.log(`Login as ${client.user.tag}`);
})

client.on('messageCreate', async messages => {
  console.log(messages.content);
  const message = client.messages.get(messages.content);

  if (!message) return;

  try {
    await message.execute(messages);
  } catch (err) {
    console.error(err);
  }
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    try {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    } catch {
      await interaction.followUp('There was an error while executing this command!');
    };
  };
});

client.login(token);