import { APIMessage } from "https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v10.ts";
import { Client } from "./Client.ts";
import { TextChannel, MessageOptions } from "./TextChannel.ts";
import { User } from "./User.ts";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export class Message {
	user: User;
	content: string;
	channelID: string;
	id: string;
	private client: Client;
	constructor(data: APIMessage, client: Client) {
		this.id = data.id;
		this.user = new User(data.author);
		this.content = data.content;
		this.channelID = data.channel_id;
		this.client = client;
	}
	public get channel(): TextChannel {
		return this.client.Cache.channels.get(this.channelID) as TextChannel;
	}
	public async reply(MessageOptions: MessageOptions | string) {
		switch (typeof MessageOptions) {
			case "string": {
				const res = await fetch(
					`https://discord.com/api/v10/channels/${this.channelID}/messages`,
					{
						method: "POST",
						body: JSON.stringify({
							content: MessageOptions,
							message_reference: {
								channel_id: this.channelID,
								message_id: this.id,
								guild_id: this.channel.guildID,
							},
						}),
						headers: {
							"User-Agent": "axios/fast.ds",
							Authorization: `Bot ${this.client.token}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log(res.status);
				if (res.status === 429) {
					await sleep((await res.json())["retry_after"] * 1000);
					await fetch(
						`https://discord.com/api/v10/channels/${this.channelID}/messages`,
						{
							method: "POST",
							body: JSON.stringify({
								content: MessageOptions,
								message_reference: {
									channel_id: this.channelID,
									message_id: this.id,
									guild_id: this.channel.guildID,
								},
							}),
							headers: {
								Authorization: `Bot ${this.client.token}`,
								"user-agent": "axios/discord.js",
								"Content-Type": "application/json",
							},
						}
					);
				}
				break;
			}
			case "object": {
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
				const res = await fetch(
					`https://discord.com/api/v10/channels/${this.channelID}/messages`,
					{
						method: "POST",
						body: JSON.stringify({
							allowed_mentions: { parse: allowedMentions },
							content: MessageOptions.content,
							tts: MessageOptions.tts,
							message_reference: {
								channel_id: this.channelID,
								message_id: this.id,
								guild_id: this.channel.guildID,
							},
						}),
						headers: {
							Authorization: `Bot ${this.client.token}`,
							"user-agent": "axios/discord.js",
							"Content-Type": "application/json",
						},
					}
				);
				if (res.status === 429) {
					await sleep((await res.json())["retry_after"] * 1000);
					await fetch(
						`https://discord.com/api/v10/channels/${this.channelID}/messages`,
						{
							method: "POST",
							body: JSON.stringify({
								allowed_mentions: { parse: allowedMentions },
								content: MessageOptions.content,
								tts: MessageOptions.tts,
								message_reference: {
									channel_id: this.channelID,
									message_id: this.id,
									guild_id: this.channel.guildID,
								},
							}),
							headers: {
								Authorization: `Bot ${this.client.token}`,
								"user-agent": "axios/discord.js",
								"Content-Type": "application/json",
							},
						}
					);
				}
				break;
			}
		}
	}
}
