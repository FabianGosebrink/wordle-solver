import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  CharacterExcludes,
  CharacterIncludes,
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
  alreadyTypedWrongWords: string[] = ['soare'];
  includeLettersOnCorrectPlace: CharacterIncludes[] = [];
  includeLettersNotOnCorrectPlace: CharacterExcludes[] = [];

  wordleForm: FormGroup;
  includes: FormArray;
  excludes: FormArray;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private wordleHelper: WordleHelperService
  ) {}

  ngOnInit(): void {
    this.updateList(
      this.alreadyTypedWrongWords,
      this.includeLettersOnCorrectPlace,
      this.includeLettersNotOnCorrectPlace
    );
    this.createForm();

    this.wordleForm.valueChanges.subscribe(({ includes, excludes }) => {
      console.log(includes);
      console.log(excludes);

      this.includeLettersOnCorrectPlace = includes;
      this.includeLettersNotOnCorrectPlace = excludes.map(
        ({ character, notOnIndexes }) => {
          return {
            character,
            notOnIndexes: notOnIndexes.split(','),
          } as CharacterExcludes;
        }
      );

      this.updateList(
        this.alreadyTypedWrongWords,
        this.includeLettersOnCorrectPlace,
        this.includeLettersNotOnCorrectPlace
      );
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.alreadyTypedWrongWords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.updateList(
      this.alreadyTypedWrongWords,
      this.includeLettersOnCorrectPlace,
      this.includeLettersNotOnCorrectPlace
    );
  }

  remove(word: string): void {
    const index = this.alreadyTypedWrongWords.indexOf(word);

    if (index >= 0) {
      this.alreadyTypedWrongWords.splice(index, 1);
    }

    this.updateList(
      this.alreadyTypedWrongWords,
      this.includeLettersOnCorrectPlace,
      this.includeLettersNotOnCorrectPlace
    );
  }

  updateList(
    alreadyTypedWrongWords: string[],
    includeLettersOnCorrectPlace: CharacterIncludes[],
    includeLettersNotOnCorrectPlace: CharacterExcludes[]
  ) {
    this.result = this.wordleHelper.solve(
      alreadyTypedWrongWords,
      includeLettersOnCorrectPlace,
      includeLettersNotOnCorrectPlace
    );
  }

  private createForm() {
    this.wordleForm = new FormGroup({
      includes: new FormArray([
        new FormGroup({
          character: new FormControl(''),
          index: new FormControl(''),
        }),
      ]),
      excludes: new FormArray([
        new FormGroup({
          character: new FormControl(''),
          notOnIndexes: new FormControl(''),
        }),
      ]),
    });

    this.includes = this.wordleForm.get('includes') as FormArray;
    this.excludes = this.wordleForm.get('excludes') as FormArray;
  }
}
