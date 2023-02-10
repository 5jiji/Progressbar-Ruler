const { StarboardAdd } = require('../../Util/Starboard.js');
const { starBoard, mastodon } = require("../../config.js");
const { checkReactionNumber } = require('../../Util/mastodon.js');

module.exports = {
  name: 'messageReactionAdd',
  on: true,
  async execute(reaction) {
    if (!reaction.partial) {
      if (starBoard) StarboardAdd(reaction)
      if (mastodon.enable && reaction.emoji.name == "🔁") checkReactionNumber(reaction)
    }
    else if (reaction.partial) {
      reaction.fetch().then(e => {
        if (starBoard) StarboardAdd(e)
        if (mastodon.enable && reaction.emoji.name == "🔁") checkReactionNumber(reaction)
      }).catch(console.error)
    }
  }
}