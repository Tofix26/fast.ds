import {
	APIMessage,
	APIUser,
} from "https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v10.ts";
import { EventEmitter } from "https://deno.land/x/event_emitter@1.0.0/mod.ts";
import { BaseChannel } from "./BaseChannel.ts";
import { Message } from "./Message.ts";
import { CacheManager } from "./CacheManager.ts";
import { TextChannel } from "./TextChannel.ts";
interface gateway {
	url: string;
	shards: number;
	session_start_limit: {
		total: number;
		remaining: number;
		reset_after: number;
		max_concurrency: number;
	};
}
interface ClientOptions {
	maxListeners?: number;
}
export declare interface Client {
	on(event: "messageCreate", listener: (message: Message) => void): this;
	on(event: "ready", listener: () => void): this;
	on(event: "channelCreate", listener: (channel: BaseChannel) => void): this;
}
// deno-lint-ignore no-explicit-any
export class Client extends EventEmitter<any> {
	token = "";
	user: APIUser = {} as APIUser;
	ws: WebSocket = {} as WebSocket;
	Cache: CacheManager = new CacheManager(this);
	constructor(options: ClientOptions) {
		super(options.maxListeners);
	}
	async login(token: string) {
		this.token = token;

		const res = await fetch("https://discord.com/api/v10/gateway/bot", {
			method: "GET",
			headers: {
				Authorization: `Bot ${this.token}`,
				"user-agent": "fast.ds",
			},
		});
		if (res.status !== 200) {
			throw new Error(`${res.status} ${res.statusText}`);
		}
		const data = (await res.json()) as gateway;
		const ws = new WebSocket(data.url + "/?v=9&encoding=json");
		let interval = 0;
		let s: null | number = null;
		this.ws = ws;
		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					op: 2,
					d: {
						token: this.token,
						properties: {
							$os: Deno.build.os,
							$browser: "axios/fast.ds",
							$device: "axios/fast.ds",
						},
						intents: 14023,
					},
				})
			);
		};
		ws.onmessage = async (message) => {
			let { data } = message;
			data = JSON.parse(data);
			s = data.s;
			if (data.op === 11) return;
			if (data.op === 10) {
				interval = data.d.heartbeat_interval;
				setInterval(() => {
					ws.send(
						JSON.stringify({
							op: 1,
							d: s,
						})
					);
				}, interval);
			}
			switch (data.t) {
				case "READY":
					this.user = data.d.user;
					await this.Cache.refresh();
					this.emit("ready");
					break;
				case "MESSAGE_CREATE":
					this.emit("messageCreate", new Message(data.d as APIMessage, this));
					break;
				case "CHANNEL_CREATE":
					if (data.d.type === 0) {
						this.Cache.channels.set(data.d.id, new TextChannel(data.d, this));
					} else {
						this.Cache.channels.set(data.d.id, new BaseChannel(data.d, this));
					}
					this.emit("channelCreate", new BaseChannel(data, this));
					break;
			}
		};
	}
}
