export interface Option {
	value: string;
	label: string;
}

export interface DynamicOptions {
	dependsOn: string;
	endpoint: string;
	method: "GET" | "POST";
}

export interface Visibility {
	dependsOn: string;
	condition: "equals";
	value: string;
}

export interface Validation {
	min?: number;
	max?: number;
	pattern?: string;
}

export interface Field {
	id: string;
	label: string;
	type: "text" | "select" | "date" | "radio" | "checkbox" | "number" | "group";
	required?: boolean;
	options?: (string | Option)[];
	dynamicOptions?: DynamicOptions;
	visibility?: Visibility;
	validation?: Validation;
	fields?: Field[];
}

export interface FormStructure {
	formId: string;
	title: string;
	fields: Field[];
}

export type FormList = FormStructure[];