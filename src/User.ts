import { APIUser } from "discord-api-types/v10";
export class User {
	private apiUser: APIUser;
	username: string;
	id: string;
	discriminator: string;
	tag: string;
	constructor(user: APIUser) {
		this.apiUser = user;
		this.username = user.username;
		this.id = user.id;
		this.discriminator = user.discriminator;
		this.tag = this.username + this.discriminator;
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
