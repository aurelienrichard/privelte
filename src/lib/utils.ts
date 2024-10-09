export const isValidId = (id: string, adjectives: string[], animals: string[]) => {
	const [adjective, animal, number] = id.split('-')

	if (!adjective || !animal || !number) return false
	if (!adjectives.includes(adjective)) return false
	if (!animals.includes(animal)) return false
	if (Number.isNaN(Number(number)) || number.length !== 3) return false

	return true
}
