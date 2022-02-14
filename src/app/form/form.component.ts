import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { IndexCharacter, MultipleIndexCharacter } from '../services/models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Output() newResult = new EventEmitter();

  excludeChars: string[] = [];
  includeChars: string[] = [];
  includeIndexChars: IndexCharacter[] = [];
  wordleForm: FormGroup;
  includeCharsWithIndex: FormArray;
  includeCharsWithWrongIndexes: FormArray;

  ngOnInit(): void {
    this.createForm();
    this.subscribeToValueChanges();
  }

  removeFormControl(index: number, formArray: FormArray) {
    const currentFormValue = this.wordleForm.value;

    formArray.removeAt(index);

    this.wordleForm.patchValue(currentFormValue);
  }

  addFormControlCorrectIndex() {
    const currentFormValue = this.wordleForm.value;
    this.includeCharsWithIndex.push(
      new FormGroup({
        character: new FormControl(''),
        index: new FormControl(''),
      })
    );

    this.wordleForm.patchValue(currentFormValue);
  }

  addFormControlWrongIndex() {
    const currentFormValue = this.wordleForm.value;
    this.includeCharsWithWrongIndexes.push(
      new FormGroup({
        character: new FormControl(''),
        indexes: new FormControl(''),
      })
    );

    this.wordleForm.patchValue(currentFormValue);
  }

  private createForm() {
    this.wordleForm = new FormGroup({
      excludeCharacters: new FormControl(''),
      // includeCharacters: new FormControl(''),
      includeCharsWithIndex: new FormArray([
        new FormGroup({
          character: new FormControl(''),
          index: new FormControl(''),
        }),
      ]),
      includeCharsWithWrongIndexes: new FormArray([
        new FormGroup({
          character: new FormControl(''),
          indexes: new FormControl(''),
        }),
      ]),
    });

    this.includeCharsWithIndex = this.wordleForm.get(
      'includeCharsWithIndex'
    ) as FormArray;

    this.includeCharsWithWrongIndexes = this.wordleForm.get(
      'includeCharsWithWrongIndexes'
    ) as FormArray;
  }

  private subscribeToValueChanges() {
    this.wordleForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(
        ({
          excludeCharacters,
          includeCharsWithWrongIndexes,
          includeCharsWithIndex,
        }) => {
          const mappedExcludedChars = this.mapToArray(excludeCharacters);

          const mappedIncludedCharsWithWrongIndexes =
            includeCharsWithWrongIndexes
              .filter((x) => !!x.character)
              .map((x) => ({
                ...x,
                indexes: x.indexes.split(','),
              }));

          const mappedIncludedCharsWithIndex = includeCharsWithIndex.filter(
            (x) => !!x.character
          );

          if (
            this.formHasAnyValues(
              mappedExcludedChars,
              mappedIncludedCharsWithWrongIndexes,
              mappedIncludedCharsWithIndex
            )
          ) {
            this.newResult.emit({
              mappedExcludedChars,
              mappedIncludedCharsWithWrongIndexes,
              mappedIncludedCharsWithIndex,
            });
          }
        }
      );
  }

  private formHasAnyValues(
    mappedExcludedChars: string[],
    mappedIncludedCharsWithWrongIndexes: MultipleIndexCharacter[],
    includeLettersOnCorrectPlace: IndexCharacter[]
  ): boolean {
    return (
      mappedExcludedChars.length > 0 ||
      mappedIncludedCharsWithWrongIndexes.length > 0 ||
      includeLettersOnCorrectPlace.length > 0
    );
  }

  private mapToArray(input: string): string[] {
    return input.split(',').filter((x) => !!x);
  }
}
