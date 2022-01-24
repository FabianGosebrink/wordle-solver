import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  CharacterIndexIncludes,
  WordleHelperService,
} from '../wordle-helper.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  excludeChars: string[] = [];
  includeChars: string[] = [];
  includeIndexChars: CharacterIndexIncludes[] = [];

  wordleForm: FormGroup;
  includeCharsWithIndex: FormArray;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private wordleHelper: WordleHelperService
  ) {}

  ngOnInit(): void {
    this.updateList(
      this.excludeChars,
      this.includeChars,
      this.includeIndexChars
    );
    this.createForm();

    this.wordleForm.valueChanges.subscribe(
      ({ excludeCharacters, includeCharacters, includeCharsWithIndex }) => {
        console.log(includeCharsWithIndex);
        console.log(includeCharacters);
        console.log(excludeCharacters);

        const mappedExcludedChars = excludeCharacters
          .split(',')
          .filter((x) => !!x);

        const mappedIncludedChars = includeCharacters
          .split(',')
          .filter((x) => !!x);

        const mappedIncludedCharsWithIndex = includeCharsWithIndex.filter(
          (x) => !!x.character
        );

        this.updateList(
          mappedExcludedChars,
          mappedIncludedChars,
          mappedIncludedCharsWithIndex
        );
      }
    );
  }

  trackBy(index, item) {
    return index;
  }

  removeFormControl(index: number) {
    const currentFormValue = this.wordleForm.value;

    this.includeCharsWithIndex.removeAt(index);

    this.wordleForm.patchValue(currentFormValue);
  }

  addFormControl() {
    const currentFormValue = this.wordleForm.value;
    this.includeCharsWithIndex.push(
      new FormGroup({
        character: new FormControl(''),
        index: new FormControl(''),
      })
    );

    this.wordleForm.patchValue(currentFormValue);
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

  private createForm() {
    this.wordleForm = new FormGroup({
      excludeCharacters: new FormControl(''),
      includeCharacters: new FormControl(''),
      includeCharsWithIndex: new FormArray([
        new FormGroup({
          character: new FormControl(''),
          index: new FormControl(''),
        }),
      ]),
    });

    this.includeCharsWithIndex = this.wordleForm.get(
      'includeCharsWithIndex'
    ) as FormArray;
  }
}
