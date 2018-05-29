const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			aliases: ['sendmessage', 'message', 'msg'],
			permissionLevel: 5,
			description: (msg) => msg.language.get('COMMAND_SENDMSG_DESCRIPTION'),
			extendedHelp: '',
			usage: '<targetUser:user|targetChannel:channel> <message:string> [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [target, ...message]) {
		if (await this.canSend(msg, target)) {
			try {
				await msg.delete();
				return target.send(message.join(' '));
			} catch (err) {
				await this.client.emit('taskError', err);
				return msg.reject();
			}
		}
		return msg.delete();
	}

	async canSend(msg, target) {
		if (target.constructor.name === 'TextChannel') {
			return target.guild === msg.guild;
		}

		if (target.constructor.name === 'KlasaUser') {
			return await msg.guild.members.has(target.id);
		}

		return false;
	}

};