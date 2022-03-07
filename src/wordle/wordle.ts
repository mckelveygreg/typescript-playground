import { wordlist } from "./data"

type LetterCount = Record<string, number>

// print count of all letters found in world list
const countLetters = () => {
	const result = wordlist.reduce((all: LetterCount, curr) => {
		curr.split("").forEach((letter) => {
			all[letter] = (all[letter] || 0) + 1
		})
		return all
	}, {})
	console.table(result)
	return result
}

const letterCount = countLetters()
const letterCountArr = Object.entries(letterCount)

const alphOrder = letterCountArr.sort((a, b) => a[0].localeCompare(b[0]))
console.table(alphOrder)

const countOrder = letterCountArr.sort((a, b) => b[1] - a[1])
console.log("Letter Count:")
console.table(
	countOrder.map((letter) => ({ Letter: letter[0], Count: letter[1] }))
)

const topLetters = countOrder.slice(0, 7)
// console.log("Top 7 letters:")
// console.table(
// 	topLetters.map((letter) => ({
// 		Letter: letter[0],
// 		Count: letter[1],
// 	}))
// )

const topWords = wordlist.filter((word) => {
	const letters = topLetters.map((l) => l[0])
	const wordChars = word.split("")
	const inTopLetters = wordChars.every((char) => letters.includes(char))
	return inTopLetters && new Set([...wordChars]).size === 5
})
console.log("All words with the 7 top letters (and no duplicated letters):")
console.table(topWords.map((word) => ({ Word: word })))

// count letters per index position
const countByIndex = wordlist.reduce(
	(all: Record<number, LetterCount>, curr) => {
		curr.split("").forEach((letter, index) => {
			all[index] = all[index] || {}
			all[index][letter] = (all[index][letter] || 0) + 1
		})
		return all
	},
	{}
)
const countByIndexArr = Object.entries(countByIndex)
console.log("")

countByIndexArr.forEach((arr) => {
	console.log(
		Object.entries(arr[1])
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map((letter) => ({
				[letter[0]]: letter[1],
			}))
	)
})

const countByIndexRank = countByIndexArr.map((position) => {
	return Object.entries(position[1])
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
})
console.log("Top 3 letters per position")
console.table(countByIndexRank)

// filter list to only words that have letters in the top letters for each index
const topWordsByIndex = wordlist.filter((word) => {
	return (
		word.split("").every((c, i) => {
			return countByIndexRank[i].some(([topLetter]) => {
				return topLetter === c
			})
		}) && new Set([...word.split("")]).size === 5
	)
})
console.log(
	"All words with the top 3 letters for each position (and no duplicated letters):"
)
console.table(topWordsByIndex.map((word) => ({ Word: word })))
// const commonWords = topWordsByIndex.filter((word) => topWords.includes(word))
// console.table(commonWords.map((word) => ({ Word: word })))
export const wordle = "wordle"
