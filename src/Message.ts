import { APIMessage } from "discord-api-types/v10";
import { User } from "./User";
import { Client } from "./Client";
import { TextChannel, MessageOptions } from "./TextChannel";
import axios from "axios";
export class Message {
	user: User;
	content: string;
	channelID: string;
	public id: string;
	private client: Client;
	constructor(message: APIMessage, client: Client) {
		this.id = message.id;
		this.user = new User(message.author);
		this.content = message.content;
		this.channelID = message.channel_id;
		this.client = client;
	}

	public get channel(): TextChannel {
		return this.client.cache.channels.get(this.channelID) as TextChannel;
	}
	public async reply(MessageOptions: MessageOptions | string) {
		switch (typeof MessageOptions) {
			case "string":
				await axios({
					method: "POST",
					url: `https://discord.com/api/v10/channels/${this.channelID}/messages`,
					data: {
						content: MessageOptions,
						message_reference: {
							channel_id: this.channelID,
							message_id: this.id,
							guild_id: this.channel.guildID,
						},
					},
					headers: {
						"User-Agent": "axios/fast.ds",
						Authorization: `Bot ${this.client.token}`,
						"Content-Type": "application/json",
					},
				});
				break;
			case "object":
				let allowedMentions = ["roles", "everyone", "users"];
				if (MessageOptions.disabledMentions) {
					if (MessageOptions.disabledMentions.everyone)
						allowedMentions = allowedMentions.filter((e) => e !== "everyone");
					if (MessageOptions.disabledMentions.roles)
						allowedMentions = allowedMentions.filter((e) => e !== "roles");
					if (MessageOptions.disabledMentions.user)
						allowedMentions = allowedMentions.filter((e) => e !== "users");
				}
				if (!MessageOptions.tts) MessageOptions.tts = false;
				await axios
					.post(
						`https://discord.com/api/v10/channels/${this.channelID}/messages`,
						{
							allowed_mentions: { parse: allowedMentions },
							content: MessageOptions.content,
							tts: MessageOptions.tts,
							message_reference: {
								channel_id: this.channelID,
								message_id: this.id,
								guild_id: this.channel.guildID,
							},
						},
						{
							headers: {
								Authorization: `Bot ${this.client.token}`,
								"user-agent": "axios/discord.js",
								"Content-Type": "application/json",
							},
						}
					)
					.catch((error) =>
						console.error(error.response.data.errors.allowed_mentions.parse[1])
					);
				break;
		}
	}
}
