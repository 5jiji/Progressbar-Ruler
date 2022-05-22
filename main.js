const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize')
const { Client, Collection } = require('discord.js');
const { token, sqlPass } = require('./config.json');

client = new Client({intents: 0});

const sequelize = new Sequelize('database', 'user', sqlPass, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
client.db = require('./Util/database')

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}


client.once('ready', () => {
  client.db.Bans.sync()
  client.db.Warns.sync()
  console.log(`Login as ${client.user.tag}`);
})


client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
  }
})

client.login(token);