import { APIChannel } from "https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v10.ts";
import { Client } from "./Client.ts";

export class BaseChannel {
	id: string;
	type: number;
	name?: string;
	private client: Client;
	constructor(data: APIChannel, client: Client) {
		this.id = data.id;
		this.type = data.type;
		data.name ? (this.name = data.name) : null;
		this.client = client;
	}
	public get isText() {
		return this.type === 0;
	}
}
