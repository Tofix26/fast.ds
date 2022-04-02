import { Client } from "./index.ts";
const client = new Client({});
client.on("ready", () => {
	console.log("Your bot is ready");
});
client.on("messageCreate", (message) => {
	if (message.user.bot) return;
	for (let i = 0; i < 10; i++) message.reply("sussy");
});
client.login("OTQxMDI4OTMyMjg1NzU5NTA4.YgP_fA.Aba6HieBZtq7wRP8Zhg1e2c0QLQ");
