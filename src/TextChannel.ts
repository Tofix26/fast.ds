import { APITextChannel } from "https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v10.ts";
import { BaseChannel } from "./BaseChannel.ts";
import { Client } from "./Client.ts";
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
	constructor(data: APITextChannel, client: Client) {
		super(data, client);
		this.guildID = data.guild_id as string;
	}
	public async send(MessageOptions: MessageOptions | string) {
		switch (typeof MessageOptions) {
			case "string": {
				await fetch(
					`https://discord.com/api/v10/channels/${this.id}/messages`,
					{
						method: "POST",
						body: JSON.stringify({
							content: MessageOptions,
						}),
						headers: {
							"User-Agent": "axios/fast.ds",
							//@ts-ignore bruhv
							Authorization: `Bot ${this.client.token}`,
							"Content-Type": "application/json",
						},
					}
				);
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
				console.log(allowedMentions);

				if (!MessageOptions.tts) MessageOptions.tts = false;
				await fetch(
					`https://discord.com/api/v10/channels/${this.id}/messages`,
					{
						method: "POST",
						body: JSON.stringify({
							allowed_mentions: { parse: allowedMentions },
							content: MessageOptions.content,
							tts: MessageOptions.tts,
						}),
						headers: {
							// @ts-ignore bruv
							Authorization: `Bot ${this.client.token}`,
							"user-agent": "axios/discord.js",
							"Content-Type": "application/json",
						},
					}
				);
				break;
			}
		}
	}
}
