export const generateArray = (length: number, item: any) => {
	const result = [];

	for (let i = 0; i < length; i++)
		result.push(item);

	return result;
};
