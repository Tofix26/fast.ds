import { APIGuild } from "discord-api-types/v10";
import { Client } from "./Client";
import { BaseChannel } from "./BaseChannel";
export declare class CacheManager {
    channels: Map<string, BaseChannel>;
    private client;
    guilds: Map<string, APIGuild>;
    constructor(client: Client);
    cacheGuilds(): Promise<Map<string, APIGuild>>;
    cacheChannels(): Promise<Map<string, BaseChannel>>;
    refresh(): Promise<void>;
}
//# sourceMappingURL=CacheManager.d.ts.map