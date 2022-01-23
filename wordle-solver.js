'use strict';

const fs = require('fs');

const alreadyTypedWrongWords = ['soare', 'print', 'trips', 'grift', 'crise'];
const includeLettersOnCorrectPlace = [
  { character: 'c', index: 0 },
  { character: 'r', index: 1 },
  { character: 'i', index: 2 },
];
const includeLettersNotOnCorrectPlace = [
  { character: 's', notOnIndexes: [0, 4, 3] },
  { character: 'o', notOnIndexes: [1] },
  { character: 'a', notOnIndexes: [2] },
  { character: 'e', notOnIndexes: [4] },
  { character: 'n', notOnIndexes: [3] },
  { character: 't', notOnIndexes: [4, 0] },
  { character: 'g', notOnIndexes: [0] },
  { character: 'f', notOnIndexes: [3] },
];

function filterWordByCharsNotOnCorrectPlace(filteredWords) {
  if (includeLettersNotOnCorrectPlace.length === 0) {
    return filteredWords;
  }

  const filtered = filteredWords.map((word) => {
    const wordNotContainsExcludedCharsOnIndex =
      includeLettersNotOnCorrectPlace.every(({ character, notOnIndexes }) => {
        return notOnIndexes.every((notIndex) => {
          const wordContainsCharAtIndex = containsCharAtIndex(
            word,
            character,
            notIndex
          );
          return !wordContainsCharAtIndex;
        });
      });

    return wordNotContainsExcludedCharsOnIndex ? word : null;
  });

  return filtered.filter(Boolean);
}

function filterWordByCharsOnCorrectPlace(filteredWords) {
  if (includeLettersOnCorrectPlace.length === 0) {
    return filteredWords;
  }

  const filtered = filteredWords.map((word) => {
    const wordContainsEveryCharAtIndex = includeLettersOnCorrectPlace.every(
      ({ character, index }) => containsCharAtIndex(word, character, index)
    );

    return wordContainsEveryCharAtIndex ? word : null;
  });

  return filtered.filter(Boolean);
}

function containsCharAtIndex(word, character, index) {
  const allCharsOfWord = word.split('');

  return allCharsOfWord[index] === character;
}

function removeAlreadyTypedWrongWords(words) {
  return words.filter((word) => !alreadyTypedWrongWords.includes(word));
}

function readWords() {
  const rawWords = fs.readFileSync('./words.json');

  return JSON.parse(rawWords);
}

function filterWords(words) {
  const wordsWithoutAlreadyTypedWrong = removeAlreadyTypedWrongWords(words);
  const wordsWithCharAtCorrectPlace = filterWordByCharsOnCorrectPlace(
    wordsWithoutAlreadyTypedWrong
  );

  return filterWordByCharsNotOnCorrectPlace(wordsWithCharAtCorrectPlace);
}

function main() {
  const words = readWords();
  const result = filterWords(words);

  console.log('result', result, result.length);
}

main();
