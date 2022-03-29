import { APIChannel } from "discord-api-types/v10";
import { Client } from "./Client";
export declare class BaseChannel {
    APIChannel: APIChannel;
    id: string;
    type: number;
    name?: string;
    guildID: string;
    private client;
    constructor(data: APIChannel, client: Client);
    get isText(): boolean;
}
//# sourceMappingURL=BaseChannel.d.ts.map