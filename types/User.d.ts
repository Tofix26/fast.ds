import { APIUser } from "discord-api-types/v10";
export declare class User {
    private apiUser;
    username: string;
    id: string;
    discriminator: string;
    tag: string;
    constructor(user: APIUser);
    get avatarURL(): string;
    get bannerURL(): string | undefined;
}
//# sourceMappingURL=User.d.ts.map