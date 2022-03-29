import { APIChannel } from "discord-api-types/v10";
import { Client } from "./Client";

export class BaseChannel {
	APIChannel: APIChannel;
	id: string;
	type: number;
	name?: string;
	guildID: string;
	private client: Client;
	constructor(data: APIChannel, client: Client) {
		this.APIChannel = data;
		this.id = data.id;
		this.type = data.type;
		data.name ? (this.name = data.name) : null;
		this.client = client;
	}
	public get isText() {
		return this.type === 0;
	}
}
