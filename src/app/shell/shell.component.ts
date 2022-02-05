import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { WordleHelperService } from '../services/wordle-helper.service';
import {
  IndexCharacter,
  MultipleIndexCharacter,
} from '../services/character-index-includes';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  result = [];
  isLoading = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private wordleHelper: WordleHelperService
  ) {}

  ngOnInit(): void {}

  onNewResult({
    mappedExcludedChars,
    mappedIncludedCharsWithWrongIndexes,
    mappedIncludedCharsWithIndex,
  }) {
    this.updateList(
      mappedExcludedChars,
      mappedIncludedCharsWithWrongIndexes,
      mappedIncludedCharsWithIndex
    );
  }

  private updateList(
    excludeChars: string[],
    mappedIncludedCharsWithWrongIndexes: MultipleIndexCharacter[],
    includeLettersOnCorrectPlace: IndexCharacter[]
  ) {
    this.result = this.wordleHelper.solve(
      excludeChars,
      mappedIncludedCharsWithWrongIndexes,
      includeLettersOnCorrectPlace
    );
  }
}
