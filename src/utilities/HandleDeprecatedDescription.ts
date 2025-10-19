import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";

export function handleDeprecatedDescription(description: string): string{
	if (description[0] === "[") {
		return description;
	} else {
		return JSON.stringify([
			{
				id: "1",
				type: ELEMENT_PARAGRAPH,
				children: [{ text: description }],
			},
		]);
	}
}