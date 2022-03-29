import { APIMessage } from "discord-api-types/v10";
import { User } from "./User";
import { Client } from "./Client";
import { TextChannel, MessageOptions } from "./TextChannel";
export declare class Message {
    user: User;
    content: string;
    channelID: string;
    id: string;
    private client;
    constructor(message: APIMessage, client: Client);
    get channel(): TextChannel;
    reply(MessageOptions: MessageOptions | string): Promise<void>;
}
//# sourceMappingURL=Message.d.ts.map