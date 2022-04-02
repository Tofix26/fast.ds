import { APIUser } from "https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v10.ts";
export class User {
	private apiUser: APIUser;
	username: string;
	id: string;
	discriminator: string;
	tag: string;
	bot: boolean;
	constructor(user: APIUser) {
		this.apiUser = user;
		this.username = user.username;
		this.id = user.id;
		this.discriminator = user.discriminator;
		this.tag = this.username + this.discriminator;
		this.bot = user.bot ? true : false;
	}
	public get avatarURL(): string {
		return `https://cdn.discordapp.com/avatars/${this.apiUser.id}/${this.apiUser.avatar}.png`;
	}

	public get bannerURL(): string | undefined {
		if (this.apiUser.banner) {
			return `https://cdn.discordapp.com/banners/${this.id}/${this.apiUser.banner}.png`;
		}
		return undefined;
	}
}
