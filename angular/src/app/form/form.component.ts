import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CharacterIndexIncludes } from '../wordle-helper.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Output() newResult = new EventEmitter();

  excludeChars: string[] = [];
  includeChars: string[] = [];
  includeIndexChars: CharacterIndexIncludes[] = [];
  wordleForm: FormGroup;
  includeCharsWithIndex: FormArray;

  constructor() {}

  ngOnInit(): void {
    this.createForm();

    this.wordleForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(
        ({ excludeCharacters, includeCharacters, includeCharsWithIndex }) => {
          const mappedExcludedChars = excludeCharacters
            .split(',')
            .filter((x) => !!x);

          const mappedIncludedChars = includeCharacters
            .split(',')
            .filter((x) => !!x);

          const mappedIncludedCharsWithIndex = includeCharsWithIndex.filter(
            (x) => !!x.character
          );

          this.newResult.emit({
            mappedExcludedChars,
            mappedIncludedChars,
            mappedIncludedCharsWithIndex,
          });
        }
      );
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
