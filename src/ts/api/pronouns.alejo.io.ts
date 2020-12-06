import Pronoun, { IPronouns } from "../types/pronouns";

async function get<T = JSON>(endpoint: string): Promise<T> {
		return await fetch(process.env.BASE_API_URL + endpoint).then(async (res: Response) => {
			return res.json() as Promise<T>;
		})
	}
	
export async function getPronouns(): Promise<IPronouns> {
		console.log("Getting pronouns");
		var res: Pronoun[] = await get<Pronoun[]>("pronouns")
		var p: IPronouns = {};
		res.forEach((pronoun: Pronoun) => {
			p[pronoun.name] = pronoun.display;
		});
		return p;
	}

export async function getUserPronoun(username: string): Promise<string | undefined> {
		if (username.length < 1) {
			return;
		}

		var res = await get<any[]>("users/" + username);
		var users: any = {};
		res.forEach((user: any) => {
			users[user.login] = user.pronoun_id;
		});
		return users[username];
	}