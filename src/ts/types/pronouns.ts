import axios, { AxiosResponse } from 'axios'

export interface IPronoun {
	name: string
	display: string
}

export interface IPronouns {
	[key: string]: string
}

export default class Pronoun implements IPronoun {
	name: string
	display: string

	constructor(name?: string, display?: string) {
		this.name = name || ""
		this.display = display || ""
	}

	static async getPronouns(): Promise<IPronouns> {
		var res: AxiosResponse<Pronoun[]> = await axios.get(process.env.BASE_API_URL + "pronouns");
		var p: IPronouns = {};
		res.data.forEach((pronoun: Pronoun) => {
			p[pronoun.name] = pronoun.display;
		});
		return p;
	}

	static async getUserPronoun(username: string): Promise<string | undefined> {
		if (username.length < 1) {
			return;
		}

		var res = await axios.get(process.env.BASE_API_URL + "users/" + username);
		var users: any = {};
		res.data.forEach((user: any) => {
			users[user.login] = user.pronoun_id;
		});
		return users[username];
	}
}
