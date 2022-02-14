import { TestBed } from '@angular/core/testing';
import { IndexCharacter, MultipleIndexCharacter } from './models';

import { WordleHelperService } from './wordle-helper.service';
import { WORDS } from './words';

describe('WordleHelperService', () => {
  let service: WordleHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordleHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should deliver correct result when excluding characters', () => {
    const words = [
      'hello',
      'henlo',
      'testi',
      'abcde',
      'xyzab',
      'metal',
      'soare',
    ];

    const excludechars = ['e'];

    const result = (service as any).filterWords(words, excludechars, [], []);

    expect(result).toEqual(['xyzab']);
  });

  it('should deliver correct result when including chars but wrong index', () => {
    const words = [
      'hello',
      'henlo',
      'testi',
      'abcde',
      'xyzab',
      'metal',
      'soare',
      'soaee',
    ];

    const excludechars = [];
    const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
      { character: 'e', indexes: [1] },
    ];

    const result = (service as any).filterWords(
      words,
      excludechars,
      includedCharsButWrongIndex,
      []
    );

    expect(result).toEqual(['abcde', 'soare', 'soaee']);
  });

  it('should deliver correct result when including chars but wrong index', () => {
    const words = [
      'hello',
      'henlo',
      'testi',
      'abcde',
      'xyzab',
      'metal',
      'soare',
      'aaeri',
      'aaerx',
    ];

    const excludechars = ['o'];
    const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
      { character: 'e', indexes: [1] },
    ];

    const result = (service as any).filterWords(
      words,
      excludechars,
      includedCharsButWrongIndex,
      []
    );

    expect(result).toEqual(['abcde', 'aaeri', 'aaerx']);
  });

  it('should deliver correct result when including chars but wrong index', () => {
    const words = [
      'hello',
      'henlo',
      'testi',
      'abcde',
      'xyzab',
      'metal',
      'soare',
      'aaeri',
      'aaerx',
    ];

    const excludechars = ['o'];
    const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
      { character: 'e', indexes: [1] },
    ];

    const includedCharsWithCorrectIndex: IndexCharacter[] = [
      { character: 'a', index: 0 },
    ];

    const result = (service as any).filterWords(
      words,
      excludechars,
      includedCharsButWrongIndex,
      includedCharsWithCorrectIndex
    );

    expect(result).toEqual(['abcde', 'aaeri', 'aaerx']);
  });

  it('should deliver correct result when including chars but wrong index with multple indexes', () => {
    const words = [
      'hello',
      'henlo',
      'testi',
      'abcde',
      'xyzab',
      'metal',
      'soare',
      'aaeri',
      'aaerx',
    ];

    const excludechars = ['o'];
    const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
      { character: 'e', indexes: [1, 4] },
    ];

    const includedCharsWithCorrectIndex: IndexCharacter[] = [];

    const result = (service as any).filterWords(
      words,
      excludechars,
      includedCharsButWrongIndex,
      includedCharsWithCorrectIndex
    );

    expect(result).toEqual(['aaeri', 'aaerx']);
  });

  it('should deliver correct result when including chars with correct index', () => {
    const words = [
      'hello',
      'henlo',
      'testi',
      'abcde',
      'xyzab',
      'metal',
      'soare',
      'aaeri',
      'aaerx',
    ];

    const excludechars = ['o'];
    const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
      { character: 'e', indexes: [1, 4] },
    ];

    const includedCharsWithCorrectIndex: IndexCharacter[] = [
      { character: 'a', index: 1 },
    ];

    const result = (service as any).filterWords(
      words,
      excludechars,
      includedCharsButWrongIndex,
      includedCharsWithCorrectIndex
    );

    expect(result).toEqual(['aaeri', 'aaerx']);
  });

  it('should deliver correct result when including chars with not correct index 2', () => {
    const excludechars = ['c,a,n,e'];
    const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
      { character: 'r', indexes: [1, 2] },
      { character: 'h', indexes: [1] },
    ];

    const includedCharsWithCorrectIndex: IndexCharacter[] = [];

    const result = (service as any).filterWords(
      WORDS,
      excludechars,
      includedCharsButWrongIndex,
      includedCharsWithCorrectIndex
    );

    expect(result).not.toContain('rhino');
  });

  describe('includeCharsByWrongIndex', () => {
    it('should work', () => {
      const indexChars = [];
      const excludechars = [];
      const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
        { character: 'r', indexes: [1, 2] },
        { character: 'h', indexes: [1] },
      ];

      const result: string[] = (service as any).includeCharsByWrongIndex(
        WORDS,
        includedCharsButWrongIndex
      );

      const correct1 = result.every((word) => word.split('')[1] !== 'r');
      expect(correct1).toBe(true);

      const correct2 = result.every((word) => word.split('')[2] !== 'r');
      expect(correct2).toBe(true);

      const correct3 = result.every((word) => word.split('')[1] !== 'h');

      expect(correct3).toBe(true);
    });
  });

  describe('filterWordByCharsOnCorrectIndex', () => {
    it('should work', () => {
      const indexChars = [
        {
          character: 'h',
          index: 1,
        },
      ];

      const excludechars = [];
      const includedCharsButWrongIndex: MultipleIndexCharacter[] = [];

      const result: string[] = (service as any).filterWords(
        WORDS,
        excludechars,
        includedCharsButWrongIndex,
        indexChars
      );

      const everyWordHasCharOnIndex = result.every(
        (word) => word.split('')[1] === 'h'
      );

      expect(everyWordHasCharOnIndex).toBe(true);
    });
  });

  describe('containsCharAtIndex', () => {
    [
      {
        word: 'henlo',
        character: 'h',
        index: 0,
        result: true,
      },
      {
        word: 'henlo',
        character: 'e',
        index: 0,
        result: false,
      },
      {
        word: 'henloh',
        character: 'h',
        index: 5,
        result: true,
      },
    ].forEach(({ word, character, index, result }) => {
      it(`${word} should have ${character} on index ${index} --> ${result}`, () => {
        const res = (service as any).containsCharAtIndex(
          word,
          character,
          index
        );

        expect(res).toBe(result);
      });
    });
  });

  describe('wordHasCharOnAnyIndex', () => {
    [
      {
        word: 'henlo',
        character: 'h',
        indexes: [0, 1, 2],
        result: true,
      },
      {
        word: 'henlo',
        character: 'e',
        indexes: [0, 3, 4],
        result: false,
      },
      {
        word: 'henloh',
        character: 'h',
        indexes: [5],
        result: true,
      },
    ].forEach(({ word, character, indexes, result }) => {
      it(`${word} should have ${character} on index ${indexes} --> ${result}`, () => {
        const res = (service as any).wordHasCharOnAnyIndex(
          word,
          character,
          indexes
        );

        expect(res).toBe(result);
      });
    });
  });
});
