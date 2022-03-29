/// <reference types="node" />
import { APIUser } from "discord-api-types/v10";
import { Message } from "./Message";
import { WebSocket } from "ws";
import { CacheManager } from "./CacheManager";
import EventEmitter from "node:events";
import { BaseChannel } from "./BaseChannel";
export declare interface Client {
    on(event: "messageCreate", listener: (message: Message) => void): this;
    on(event: "ready", listener: () => void): this;
    on(event: "channelCreate", listener: (channel: BaseChannel) => void): this;
}
export declare class Client extends EventEmitter {
    token: string;
    user: APIUser;
    ws: WebSocket;
    cache: CacheManager;
    constructor();
    login(Token: string): Promise<void>;
}
//# sourceMappingURL=Client.d.ts.map