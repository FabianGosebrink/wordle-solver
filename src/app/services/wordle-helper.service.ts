import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { IndexCharacter, MultipleIndexCharacter } from './models';
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

    return this.filterWordByCharsOnCorrectIndex(
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

    wordsIncludingChar.forEach((word) => {
      if (
        !this.wordContainsAnyOfCharsOnIndex(word, includeCharsWithWrongIndexes)
      ) {
        toReturn.push(word);
      }
    });

    return toReturn;
  }

  private wordContainsAnyOfCharsOnIndex(
    word,
    includeCharsWithWrongIndexes: MultipleIndexCharacter[]
  ) {
    for (const index of includeCharsWithWrongIndexes) {
      if (this.hasWordAnyCharOnIndex(word, index)) {
        return true;
      }
    }

    return false;
  }

  private hasWordAnyCharOnIndex(
    word,
    includeCharsWithWrongIndex: MultipleIndexCharacter
  ) {
    const allChars = word.split('');

    const { indexes, character } = includeCharsWithWrongIndex;

    for (const index of indexes) {
      if (allChars[index] === character) {
        return true;
      }
    }

    return false;
  }

  private filterWordByCharsOnCorrectIndex(
    filteredWords: string[],
    includeLettersOnCorrectIndex: IndexCharacter[]
  ): string[] {
    if (!includeLettersOnCorrectIndex) {
      return filteredWords;
    }

    if (includeLettersOnCorrectIndex?.length === 0) {
      return filteredWords;
    }

    const hasEntriesToProcess =
      includeLettersOnCorrectIndex.map((x) => x.character).filter((x) => !!x)
        .length > 0;

    if (!hasEntriesToProcess) {
      return filteredWords;
    }

    const filtered = filteredWords.map((word) => {
      const wordContainsEveryCharAtIndex = includeLettersOnCorrectIndex.every(
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

  private containsCharAtIndex(word: string, character: string, index: number) {
    const allCharsOfWord = word.split('');

    return allCharsOfWord[index] === character;
  }
}
