import { APITextChannel } from "discord-api-types/v10";
import { Client } from "./Client";
import { BaseChannel } from "./BaseChannel";
export interface MessageOptions {
    content?: string;
    tts?: boolean;
    disabledMentions?: {
        user?: boolean;
        roles?: boolean;
        everyone?: boolean;
        repliedUser?: boolean;
    };
    embeds?: [];
}
export declare class TextChannel extends BaseChannel {
    guildID: string;
    nsfw: boolean;
    constructor(data: APITextChannel, client: Client);
    send(MessageOptions: MessageOptions | string): Promise<void>;
}
//# sourceMappingURL=TextChannel.d.ts.map