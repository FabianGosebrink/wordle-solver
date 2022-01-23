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

function filterWordByCharsNotOnCorrectPlace(words2) {
  if (includeLettersNotOnCorrectPlace.length === 0) {
    return words2;
  }

  const filtered = words2.map((word) => {
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

    if (wordNotContainsExcludedCharsOnIndex) {
      return word;
    }
  });

  return filtered.filter(Boolean);
}

function filterWordByCharsOnCorrectPlace(words3) {
  if (includeLettersOnCorrectPlace.length === 0) {
    return words3;
  }

  const filtered = words3.map((word) => {
    const wordContainsEveryCharAtIndex = includeLettersOnCorrectPlace.every(
      ({ character, index }) => containsCharAtIndex(word, character, index)
    );

    if (wordContainsEveryCharAtIndex) {
      return word;
    }
  });

  return filtered.filter(Boolean);
}

function containsCharAtIndex(word, character, index) {
  const allCharsOfWord = word.split('');

  return allCharsOfWord[index] === character;
}

function removeAlreadyTypedWrongWords(words3) {
  return words3.filter((word) => !alreadyTypedWrongWords.includes(word));
}

function main() {
  const rawWords = fs.readFileSync('./words.json');
  const words = JSON.parse(rawWords);

  const wordsWithoutAlreadyTypedWrong = removeAlreadyTypedWrongWords(words);
  const wordsWithCharAtCorrectPlace = filterWordByCharsOnCorrectPlace(
    wordsWithoutAlreadyTypedWrong
  );

  const wordsWithIncludingLetters = filterWordByCharsNotOnCorrectPlace(
    wordsWithCharAtCorrectPlace
  );

  console.log(
    'result',
    wordsWithIncludingLetters,
    wordsWithIncludingLetters.length
  );
}

main();
