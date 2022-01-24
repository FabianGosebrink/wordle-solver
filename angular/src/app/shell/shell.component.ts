import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  CharacterIndexIncludes,
  WordleHelperService,
} from '../wordle-helper.service';

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
    mappedIncludedChars,
    mappedIncludedCharsWithIndex,
  }) {
    this.isLoading = true;

    this.updateList(
      mappedExcludedChars,
      mappedIncludedChars,
      mappedIncludedCharsWithIndex
    );

    this.isLoading = false;
  }

  private updateList(
    excludeChars: string[],
    includeChars: string[],
    includeLettersOnCorrectPlace: CharacterIndexIncludes[]
  ) {
    this.result = this.wordleHelper.solve(
      excludeChars,
      includeChars,
      includeLettersOnCorrectPlace
    );
  }
}
