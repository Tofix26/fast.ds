import {
	APIChannel,
	APIGuild,
} from "https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v10.ts";
import { BaseChannel } from "./BaseChannel.ts";
import { Client } from "./Client.ts";
import { TextChannel } from "./TextChannel.ts";

export class CacheManager {
	channels: Map<string, BaseChannel> = new Map();
	private client: Client;
	guilds: Map<string, APIGuild> = new Map();
	constructor(client: Client) {
		this.client = client;
	}
	public async cacheGuilds() {
		const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
			headers: {
				Authorization: `Bot ${this.client.token}`,
				"User-agent": "axios/fast.ds",
				encoding: "json",
			},
		});
		const guilds: Map<string, APIGuild> = new Map();
		for (const guild of await res.json()) {
			guilds.set(guild.id, guild);
		}
		return guilds;
	}
	public async cacheChannels() {
		let channels: APIChannel[] = [] as APIChannel[];
		for (const guild of Array.from(this.guilds.values())) {
			const data = await fetch(
				`https://discord.com/api/v10/guilds/${guild.id}/channels`,
				{
					headers: {
						Authorization: `Bot ${this.client.token}`,
						"User-agent": "axios/fast.ds",
						encoding: "json",
					},
				}
			);
			channels = [...channels, ...(await data.json())];
		}
		const Channels: Map<string, BaseChannel> = new Map();
		for (const channel of channels) {
			if (channel.type === 0) {
				Channels.set(channel.id, new TextChannel(channel, this.client));
				continue;
			}
			Channels.set(channel.id, new BaseChannel(channel, this.client));
		}
		return Channels;
	}
	public async refresh() {
		this.guilds = await this.cacheGuilds();
		this.channels = await this.cacheChannels();
	}
}
