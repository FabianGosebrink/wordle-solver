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

    console.log(result);

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
});
