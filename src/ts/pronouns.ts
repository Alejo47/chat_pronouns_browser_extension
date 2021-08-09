import { IPronouns } from './types/pronouns';
import * as API from './api/pronouns.alejo.io';

let pronouns: IPronouns;

export const setPronouns = (value: IPronouns) => {
	pronouns = value
}

export const getPronouns = (): IPronouns => {
	return pronouns
}

export const initPronouns = async (): Promise<void> => {
	const pronouns = await API.getPronouns();
	setPronouns(pronouns);
}

export const getUserPronoun = async (username: string) => {	
	const pronouns = getPronouns();
	const pronounKey: string | undefined = await API.getUserPronounKey(username);

	if (!pronouns || !pronounKey || !pronouns.hasOwnProperty(pronounKey)) {
		return;
	}

	const pronoun = pronouns[pronounKey];

	return pronoun;
}