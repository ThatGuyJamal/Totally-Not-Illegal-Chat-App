import AbyssCommandHandler from "./main.js";
import Command from "./classes/cmd/Command.js";
import { CommandType, CooldownTypes, DefaultCommands, } from "./typings/index.js";
export { AbyssCommandHandler, Command, CommandType, CooldownTypes, DefaultCommands, };
// test
// import { Client } from "discord.js";
// import path from "node:path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const client = new Client({ intents: 32767 });
// new AbyssCommandHandler({
//   client,
//   commandsDir: path.join(__dirname, "classes"),
// });
// process
//   .on("unhandledRejection", (err, promise) => {
//     console.error("Unhandled Rejection:", err, promise);
//   })
//   .on("uncaughtException", (err) => {
//     console.error("Uncaught Exception:", err);
//   })
//   .on("uncaughtExceptionMonitor", (err, origin) => {
//     console.error("Uncaught Exception Monitor:", err, origin);
//   });
