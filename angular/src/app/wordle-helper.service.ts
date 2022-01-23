import { Injectable } from '@angular/core';
import { WORDS } from './words';

export interface CharacterIncludes {
  character: string;
  index: number;
}

export interface CharacterExcludes {
  character: string;
  notOnIndexes: number[];
}

@Injectable({
  providedIn: 'root',
})
export class WordleHelperService {
  // private includeLettersOnCorrectPlace = [
  //   // { character: 'c', index: 0 },
  //   // { character: 'r', index: 1 },
  //   // { character: 'i', index: 2 },
  // ];
  // private includeLettersNotOnCorrectPlace = [
  //   // { character: 's', notOnIndexes: [0, 4, 3] },
  //   // { character: 'o', notOnIndexes: [1] },
  //   // { character: 'a', notOnIndexes: [2] },
  //   // { character: 'e', notOnIndexes: [4] },
  //   // { character: 'n', notOnIndexes: [3] },
  //   // { character: 't', notOnIndexes: [4, 0] },
  //   // { character: 'g', notOnIndexes: [0] },
  //   // { character: 'f', notOnIndexes: [3] },
  // ];

  solve(
    alreadyTypedWords: string[],
    includeLettersOnCorrectPlace: CharacterIncludes[],
    includeLettersNotOnCorrectPlace: CharacterExcludes[]
  ): string[] {
    return this.solveInternal(
      alreadyTypedWords,
      includeLettersOnCorrectPlace,
      includeLettersNotOnCorrectPlace
    );
  }

  private filterWordByCharsNotOnCorrectPlace(
    filteredWords: string[],
    includeLettersNotOnCorrectPlace: CharacterExcludes[]
  ) {
    if (includeLettersNotOnCorrectPlace.length === 0) {
      return filteredWords;
    }

    const filtered = filteredWords.map((word: string) => {
      const wordDoesNotContainAnyExcludedCharsOnIndex =
        includeLettersNotOnCorrectPlace.every(({ character, notOnIndexes }) => {
          return notOnIndexes.every(
            (notIndex) => !this.containsCharAtIndex(word, character, notIndex)
          );
        });

      return wordDoesNotContainAnyExcludedCharsOnIndex ? word : null;
    });

    return filtered.filter(Boolean);
  }

  private filterWordByCharsOnCorrectPlace(
    filteredWords: string[],
    includeLettersOnCorrectPlace: CharacterIncludes[]
  ): string[] {
    if (includeLettersOnCorrectPlace.length === 0) {
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

  private removeAlreadyTypedWrongWords(
    words: string[],
    alreadyTypedWrongWords: string[]
  ) {
    return words.filter((word) => !alreadyTypedWrongWords.includes(word));
  }

  private filterWords(
    words: string[],
    alreadyTypedWrongWords: string[],
    includeLettersOnCorrectPlace: CharacterIncludes[],
    includeLettersNotOnCorrectPlace: CharacterExcludes[]
  ) {
    const wordsWithoutAlreadyTypedWrong = this.removeAlreadyTypedWrongWords(
      words,
      alreadyTypedWrongWords
    );
    const wordsWithCharAtCorrectPlace = this.filterWordByCharsOnCorrectPlace(
      wordsWithoutAlreadyTypedWrong,
      includeLettersOnCorrectPlace
    );

    return this.filterWordByCharsNotOnCorrectPlace(
      wordsWithCharAtCorrectPlace,
      includeLettersNotOnCorrectPlace
    );
  }

  private solveInternal(
    alreadyTypedWrongWords: string[],
    includeLettersOnCorrectPlace: CharacterIncludes[],
    includeLettersNotOnCorrectPlace: CharacterExcludes[]
  ): string[] {
    const words = WORDS;
    const result = this.filterWords(
      words,
      alreadyTypedWrongWords,
      includeLettersOnCorrectPlace,
      includeLettersNotOnCorrectPlace
    );

    return result;
  }
}
