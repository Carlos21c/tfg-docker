import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormstateService {
  private formState: any = null;

  saveFormState(state: any) {
    this.formState = state;
  }

  getFormState() {
    return this.formState;
  }

  clearFormState() {
    this.formState = null;
  }
}
