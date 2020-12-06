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
}
