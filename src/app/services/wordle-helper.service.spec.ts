import { TestBed } from '@angular/core/testing';
import {
  IndexCharacter,
  MultipleIndexCharacter,
} from './character-index-includes';

import { WordleHelperService } from './wordle-helper.service';

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
    const words = [
      'humph',
      'blush',
      'ivory',
      'swirl',
      'fjord',
      'motor',
      'thumb',
      'dowry',
      'ought',
      'blurt',
      'pithy',
      'robot',
      'light',
      'humor',
      'slosh',
      'story',
      'showy',
      'rusty',
      'hydro',
      'roomy',
      'youth',
      'whoop',
      'sooth',
      'glory',
      'usurp',
      'bough',
      'sloth',
      'vigor',
      'howdy',
      'floor',
      'quirk',
      'photo',
      'glyph',
      'hippy',
      'tough',
      'humid',
      'lymph',
    ];

    const excludechars = ['c,a,n,e'];
    const includedCharsButWrongIndex: MultipleIndexCharacter[] = [
      { character: 'r', indexes: [1, 2] },
      { character: 'h', indexes: [1] },
    ];

    const includedCharsWithCorrectIndex: IndexCharacter[] = [];

    const result = (service as any).filterWords(
      words,
      excludechars,
      includedCharsButWrongIndex,
      includedCharsWithCorrectIndex
    );

    console.log(result);

    expect(result).toEqual(['humor', 'hydro', 'humor', 'hydro']);
  });
});
