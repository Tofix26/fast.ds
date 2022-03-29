import { APITextChannel } from "discord-api-types/v10";
import axios from "axios";
import { Client } from "./Client";
import { BaseChannel } from "./BaseChannel";
export interface MessageOptions {
	content?: string;
	tts?: boolean;
	disabledMentions?: {
		user?: boolean;
		roles?: boolean;
		everyone?: boolean;
		repliedUser?: boolean;
	};
	embeds?: [];
}
export class TextChannel extends BaseChannel {
	guildID: string;
	nsfw: boolean
	constructor(data: APITextChannel, client: Client) {
		super(data, client);
		this.guildID = data.guild_id;
		this.nsfw = data.nsfw
	}
	public async send(MessageOptions: MessageOptions | string) {
		switch (typeof MessageOptions) {
			case "string":
				await axios({
					method: "POST",
					url: `https://discord.com/api/v10/channels/${this.id}/messages`,
					data: {
						content: MessageOptions,
					},
					headers: {
						"User-Agent": "axios/fast.ds",
						//@ts-ignore bruhv
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
				console.log(allowedMentions);

				if (!MessageOptions.tts) MessageOptions.tts = false;
				await axios
					.post(
						`https://discord.com/api/v10/channels/${this.id}/messages`,
						{
							allowed_mentions: { parse: allowedMentions },
							content: MessageOptions.content,
							tts: MessageOptions.tts,
						},
						{
							headers: {
								//@ts-ignore bruv
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
