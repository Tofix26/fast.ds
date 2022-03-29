import axios from "axios";
import { APIUser, APIMessage } from "discord-api-types/v10";
import { Message } from "./Message";
import { WebSocket } from "ws";
import os from "node:os";
import { CacheManager } from "./CacheManager";
import EventEmitter from "node:events";
import { BaseChannel } from "./BaseChannel";
import { TextChannel } from "./TextChannel";
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

export declare interface Client {
	on(event: "messageCreate", listener: (message: Message) => void): this;
	on(event: "ready", listener: () => void): this;
	on(event: "channelCreate", listener: (channel: BaseChannel) => void): this;
}
export class Client extends EventEmitter {
	token: string = "";
	user: APIUser = {} as APIUser;
	ws: WebSocket = {} as WebSocket;
	cache: CacheManager = {} as CacheManager;
	constructor() {
		super({ captureRejections: true });
	}
	async login(Token: string) {
		this.token = Token;
		const res = await axios.get("https://discord.com/api/v10/gateway/bot", {
			headers: {
				Authorization: `Bot ${this.token}`,
				"user-agent": "axios/discord.js",
			},
		});
		if (res.status !== 200) {
			throw new Error(`${res.status} ${res.statusText}`);
		}
		const data = res.data as gateway;
		const ws = new WebSocket(data.url + "/?v=9&encoding=json");
		let interval = 0;
		let s: null | number = null;
		this.ws = ws;
		ws.on("open", () => {
			ws.send(
				JSON.stringify({
					op: 2,
					d: {
						token: this.token,
						properties: {
							$os: os.platform(),
							$browser: "axios/fast.ds",
							$device: "axios/fast.ds",
						},
						intents: 14023,
					},
				})
			);
		});
		ws.on("message", async (e) => {
			let data = JSON.parse(e.toString());
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
					this.cache = await new CacheManager(this);
					await this.cache.refresh();
					setTimeout(() => {
						this.emit("ready");
					}, 1000);
					break;
				case "MESSAGE_CREATE":
					this.emit("messageCreate", new Message(data.d as APIMessage, this));
					break;
				case "CHANNEL_CREATE":
					if (data.d.type === 0) {
						this.cache.channels.set(data.d.id, new TextChannel(data.d, this));
						console.log(this.cache.channels.get(data.d.id));
					} else {
						this.cache.channels.set(data.d.id, new BaseChannel(data.d, this));
					}
					this.emit("channelCreate", new BaseChannel(data, this));
					break;
			}
		});
	}
}
