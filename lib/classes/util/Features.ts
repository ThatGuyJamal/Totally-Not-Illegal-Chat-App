import { Client } from "discord.js";
import ACH from "../../../typings";
import getAllFiles from "../../utils/get-all-files";

export default class FeaturesHandler {
	constructor(instance: ACH, featuresDir: string, client: Client) {
		this.readFiles(instance, featuresDir, client);
	}

	private async readFiles(instance: ACH, featuresDir: string, client: Client) {
		const files = getAllFiles(featuresDir);

		for (const file of files) {
			let func = require(file.filePath);
			func = func.default || func;

			if (func instanceof Function) {
				await func(instance, client);
			}
		}
	}
}
