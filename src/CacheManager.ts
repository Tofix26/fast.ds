import { TextChannel } from "./TextChannel";
import { APIGuild, APIChannel, APITextChannel } from "discord-api-types/v10";
import { Client } from "./Client";
import axios from "axios";
import { BaseChannel } from "./BaseChannel";
export class CacheManager {
	channels: Map<string, BaseChannel> = new Map();
	private client: Client;
	guilds: Map<string, APIGuild> = new Map();
	constructor(client: Client) {
		this.client = client;
	}
	public async cacheGuilds() {
		let data = await axios.get("https://discord.com/api/v10/users/@me/guilds", {
			headers: {
				Authorization: `Bot ${this.client.token}`,
				"User-agent": "axios/fast.ds",
				encoding: "json",
			},
		});
		let guilds: Map<string, APIGuild> = new Map();
		for (const guild of data.data) {
			guilds.set(guild.id, guild);
		}
		return guilds;
	}
	public async cacheChannels() {
		let channels: APIChannel[] = [] as APIChannel[];
		for (const guild of Array.from(this.guilds.values())) {
			let data = await axios.get(
				`https://discord.com/api/v10/guilds/${guild.id}/channels`,
				{
					headers: {
						Authorization: `Bot ${this.client.token}`,
						"User-agent": "axios/fast.ds",
						encoding: "json",
					},
				}
			);
			channels = [...channels, ...data.data];
		}
		let Channels: Map<string, BaseChannel> = new Map();
		for (let channel of channels) {
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
