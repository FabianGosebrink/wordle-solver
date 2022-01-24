import { Injectable } from '@angular/core';
import { WORDS } from './words';

export interface CharacterIndexIncludes {
  character: string;
  index: number;
}

@Injectable({
  providedIn: 'root',
})
export class WordleHelperService {
  solve(
    excludeChars: string[],
    includeChars: string[],
    includeCharsWithIndex: CharacterIndexIncludes[]
  ): string[] {
    const words = WORDS;

    return this.filterWords(
      words,
      excludeChars,
      includeChars,
      includeCharsWithIndex
    );
  }

  private includeChars(words: string[], includeChars: string[]) {
    if (includeChars.length === 0) {
      return words;
    }

    let toReturn = [];

    for (const word of words) {
      if (this.wordContainsAllOfChars(word, includeChars)) {
        toReturn.push(word);
      }
    }

    return toReturn;
  }

  private filterWordByCharsOnCorrectPlace(
    filteredWords: string[],
    includeLettersOnCorrectPlace: CharacterIndexIncludes[]
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

  private containsCharAtIndex(word: string, character: string, index: number) {
    const allCharsOfWord = word.split('');

    return allCharsOfWord[index] === character;
  }

  private excludeChars(words: string[], excludeChars: string[]): string[] {
    if (excludeChars.length === 0) {
      return words;
    }

    let toReturn = [];

    for (const word of words) {
      if (!this.wordContainsAnyOfChars(word, excludeChars)) {
        toReturn.push(word);
      }
    }

    return toReturn;
  }

  private wordContainsAnyOfChars(word: string, exludedChars: string[]) {
    return exludedChars.some((x) => word.split('').includes(x));
  }

  private wordContainsAllOfChars(word: string, exludedChars: string[]) {
    return exludedChars.every((x) => word.split('').includes(x));
  }

  private filterWords(
    words: string[],
    excludeChars: string[],
    includeChars: string[],
    includeCharsWithIndex: CharacterIndexIncludes[]
  ) {
    const wordsWithCharsExcluded = this.excludeChars(words, excludeChars);
    const wordsWithCharsIncluded = this.includeChars(
      wordsWithCharsExcluded,
      includeChars
    );

    return this.filterWordByCharsOnCorrectPlace(
      wordsWithCharsIncluded,
      includeCharsWithIndex
    );
  }
}
