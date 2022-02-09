import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import {
  IndexCharacter,
  MultipleIndexCharacter,
} from './character-index-includes';
import { WORDS } from './words';

@Injectable({
  providedIn: 'root',
})
export class WordleHelperService {
  solve(
    excludeChars: string[],
    includeCharsWithWrongIndexes: MultipleIndexCharacter[],
    includeCharsWithIndex: IndexCharacter[]
  ): string[] {
    const words = WORDS;

    return this.filterWords(
      words,
      excludeChars,
      includeCharsWithWrongIndexes,
      includeCharsWithIndex
    );
  }

  private filterWords(
    words: string[],
    excludeChars: string[],
    includeCharsWithWrongIndexes: MultipleIndexCharacter[],
    includeCharsWithIndex: IndexCharacter[]
  ) {
    const wordsWithCharsExcluded = this.excludeChars(words, excludeChars);
    const wordsWithCharsIncluded = this.includeCharsByWrongIndex(
      wordsWithCharsExcluded,
      includeCharsWithWrongIndexes
    );

    return this.filterWordByCharsOnCorrectPlace(
      wordsWithCharsIncluded,
      includeCharsWithIndex
    );
  }

  private includeCharsByWrongIndex(
    words: string[],
    includeCharsWithWrongIndexes: MultipleIndexCharacter[]
  ) {
    if (includeCharsWithWrongIndexes?.length === 0) {
      return words;
    }

    const hasEntriesToProcess =
      includeCharsWithWrongIndexes.map((x) => x.character).filter((x) => !!x)
        .length > 0;

    if (!hasEntriesToProcess) {
      return words;
    }

    const allChars = includeCharsWithWrongIndexes.map((x) => x.character);

    const wordsIncludingChar = this.includeAllChars(words, allChars);

    let toReturn = [];

    includeCharsWithWrongIndexes.forEach(({ character, indexes }) => {
      const filtered = wordsIncludingChar.filter(
        (word) => !this.wordHasCharOnAnyIndex(word, character, indexes)
      );

      toReturn.push(...filtered);
    });

    return toReturn;
  }

  private filterWordByCharsOnCorrectPlace(
    filteredWords: string[],
    includeLettersOnCorrectPlace: IndexCharacter[]
  ): string[] {
    if (!includeLettersOnCorrectPlace) {
      return filteredWords;
    }

    if (includeLettersOnCorrectPlace?.length === 0) {
      return filteredWords;
    }

    const hasEntriesToProcess =
      includeLettersOnCorrectPlace.map((x) => x.character).filter((x) => !!x)
        .length > 0;

    if (!hasEntriesToProcess) {
      return filteredWords;
    }

    const filtered = filteredWords.map((word) => {
      const wordContainsEveryCharAtIndex = includeLettersOnCorrectPlace.every(
        ({ character, index }) =>
          this.containsCharAtIndex(word, character, index)
      );

      return wordContainsEveryCharAtIndex ? word : null;
    });

    return filtered.filter(Boolean);
  }

  private excludeChars(words: string[], excludeChars: string[]): string[] {
    if (excludeChars.length === 0) {
      return words;
    }

    return words.filter(
      (word) => !this.wordContainsAnyOfChars(word, excludeChars)
    );
  }

  private includeAllChars(words: string[], includeChars: string[]): string[] {
    if (includeChars.length === 0) {
      return words;
    }

    return words.filter((word) =>
      this.wordContainsAllOfChars(word, includeChars)
    );
  }

  private wordContainsAnyOfChars(word: string, exludedChars: string[]) {
    return exludedChars.some((x) => this.wordContainsChar(word, x));
  }

  private wordContainsAllOfChars(word: string, exludedChars: string[]) {
    return exludedChars.every((x) => this.wordContainsChar(word, x));
  }

  private wordContainsChar(word: string, char: string): boolean {
    return word.split('').includes(char);
  }

  private wordHasCharOnAnyIndex(
    word: string,
    char: string,
    indexes: number[]
  ): boolean {
    return indexes.some((index) => this.containsCharAtIndex(word, char, index));
  }
  private containsCharAtIndex(word: string, character: string, index: number) {
    const allCharsOfWord = word.split('');

    return allCharsOfWord[index] === character;
  }
}
