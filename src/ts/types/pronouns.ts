import axios, { AxiosResponse } from 'axios'

export interface IPronoun {
	name: string
	display: string

	isBot: boolean;
}

export default class Pronoun implements IPronoun {
	name: string
	display: string

	constructor(name?: string, display?: string) {
		this.name = name || ""
		this.display = display || ""
	}

	get isBot(): boolean {
		return (name == "bot");
	}

	// static async getPronouns(): Promise<Pronoun[]> {
	// 	let res: AxiosResponse<Pronoun[]> = await axios.get(process.env.VUE_APP_BACKEND_BASE_URI + '/pronouns');
	// 	return res.data;
	// }

	static async getPronouns() {
		var res: AxiosResponse<Pronoun[]> = await (await axios.get(process.env.BASE_API_URL + "pronouns"));
		var p: { [key: string]: string } = {};
		res.data.forEach((pronoun: Pronoun) => {
			p[pronoun.name] = pronoun.display;
		});
		return p;
	}

	static setItem(key: string, value: object) {
		sessionStorage.setItem(key, JSON.stringify(value));
	}
	static getItem(key: string) {
		return JSON.parse(sessionStorage.getItem(key) || "{}");
	}

	static async getUserPronouns() {
		if (this.getItem('pronouns')) {
			return this.getItem('pronouns');
		}
		else {
			var res = await axios.get(process.env.BASE_API_URL + "users");
			var pronouns: { [key: string]: string } = {};
			res.data.forEach((user: any) => {
				pronouns[user.login] = user.pronoun_id;
			});
			this.setItem('pronouns', pronouns);
			return res.data;
		}
	}
	static async getUserPronoun(username: string) {
		if (username == null || username.length < 1) {
			return;
		}

		let localPronouns = this.getItem('pronouns');
		if (localPronouns && localPronouns[username]) {
			return localPronouns[username];
		}
		else {
			var res = await axios.get(process.env.BASE_API_URL + "users/" + username);
			var pronouns: any = {};

			if (localPronouns) {
				pronouns = localPronouns;
			}
			res.data.forEach((user: any) => {
				pronouns[user.login] = user.pronoun_id;
			});
			this.setItem('pronouns', pronouns);
			return pronouns[username];
		}
	}
}
