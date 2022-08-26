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

const consonantDigraphs = [
	// digraphs
	"bl",
	"br",
	"ch",
	"ck",
	"cl",
	"cr",
	"dr",
	"fl",
	"fr",
	"gh",
	"gl",
	"gr",
	"ng",
	"ph",
	"pl",
	"pr",
	"qu",
	"sc",
	"sh",
	"sk",
	"sl",
	"sm",
	"sn",
	"sp",
	"st",
	"sw",
	"th",
	"tr",
	"tw",
	"wh",
	"wr",
	// trigraphs
	"nth",
	"sch",
	"scr",
	"shr",
	"spl",
	"spr",
	"squ",
	"str",
	"thr",
	// vowel digraphs
	"ai",
	"au",
	"aw",
	"ay",
	"ea",
	"ee",
	"ei",
	"eu",
	"ew",
	"ey",
	"ie",
	"oi",
	"oo",
	"ou",
	"ow",
	"oy",
]

// count occurrences of digraphs
const digraphCount = wordlist.reduce((all: LetterCount, curr) => {
	consonantDigraphs.forEach((digraph) => {
		if (curr.includes(digraph)) {
			if (all?.[digraph]) {
				all[digraph]++
			} else {
				all[digraph] = 1
			}
		}
	})
	return all
}, {})
const sortedDigraphCount = Object.entries(digraphCount).sort(
	(a, b) => b[1] - a[1]
)
console.log(
	"Digraph Count:",
	sortedDigraphCount.map(([digraph, count]) => ({
		Digraph: digraph,
		Count: count,
	}))
)

const wordsWithDigraphAndTopLetters = wordlist.filter((word) => {
	return (
		word.split("").every((c) => {
			return (
				countOrder
					// use top 8 letters
					.slice(0, 8)
					.map(([letter]) => letter)
					.includes(c)
			)
		}) &&
		// top 5 digraphs
		sortedDigraphCount.slice(0, 10).some(([digraph]) => {
			return word.includes(digraph)
		}) &&
		new Set([...word.split("")]).size === 5
	)
	// consonantDigraphs.slice(0, 5).some((digraph) => word.includes(digraph)) &&
	// new Set([...word.split("")]).size === 5
	// )
})
console.log(
	"All words with the top 8 letters for each position (and no duplicated letters), and with the top 10 digraphs:"
)
console.table(wordsWithDigraphAndTopLetters.map((word) => ({ Word: word })))

// word score
const getWordScore = (list: Readonly<string[]>) =>
	list.reduce((all: LetterCount, curr) => {
		const score = curr.split("").reduce((total, letter) => {
			return total + countOrder.findIndex(([l]) => l === letter)
		}, 0)
		if (new Set([...curr.split("")]).size === 5) {
			all[curr] = score
		}
		return all
	}, {})

const wordScoreDigraphs = getWordScore(wordsWithDigraphAndTopLetters)

const sortedWordScoreDigraphs = Object.entries(wordScoreDigraphs).sort(
	(a, b) => b[1] - a[1]
)
console.log(
	"Word Score:",
	sortedWordScoreDigraphs.map(([word, score]) => ({ Word: word, Score: score }))
)

const wordScore = getWordScore(wordlist)
const sortedWordScore = Object.entries(wordScore)
	.sort((a, b) => b[1] - a[1])
	.reverse()
	.slice(0, 30)

console.log(
	"Word Score:",
	sortedWordScore.map(([word, score]) => ({ Word: word, Score: score }))
)
