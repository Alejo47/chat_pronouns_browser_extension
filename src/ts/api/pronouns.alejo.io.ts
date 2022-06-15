import Pronoun, { IPronouns } from "src/ts/types/deprecated/pronouns";
import { IUser } from "src/ts/types/deprecated/users";

async function get<T = JSON>(endpoint: string): Promise<T> {
	return await fetch(process.env.BASE_API_URL + endpoint).then(async (res: Response) => {
		return res.json() as Promise<T>;
	})
}
	
export async function getPronouns(): Promise<IPronouns> {
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

	var res = await get<IUser[]>("users/" + username);
	let match: IUser | undefined = res.find((user: IUser) => {
		return user.login.toLowerCase() === username.toLowerCase();
	})

	if (match !== undefined) {
		return match.pronoun_id;
	}
}