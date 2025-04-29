import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() onFilter = new EventEmitter<{ search: string; milk: string | null }>();

  formGroup: FormGroup

  searchCtrl: FormControl
  milkCtrl: FormControl

  isSearch: boolean = false;

  private milkSub: Subscription | null = null;

  constructor() {
    this.searchCtrl = new FormControl('', { validators: [Validators.minLength(3)], nonNullable: true })
    this.milkCtrl = new FormControl(null)


    this.formGroup = new FormGroup({
      searchCtrl: this.searchCtrl,
      milkCtrl: this.milkCtrl
    })
  }

  //DECLENCHEMENT DE LA RECHERCHE DIRECT QUAND UN BOUTON RADIO EST SELECTIONNE
  ngOnInit(): void {
    this.milkSub = this.milkCtrl.valueChanges.subscribe(() => {
      this.emitFilter();
    });
  }

  ngOnDestroy(): void {
    if (this.milkSub) {
      this.milkSub.unsubscribe();
    }
  }


  //POUR LE CHAMP DE RECHERCHE
  onSub(): void {

    if (this.searchCtrl.value == '') {
      this.isSearch = false;
    }
    else {
      this.isSearch = true
    }

    this.emitFilter();
  }


  private emitFilter(): void {
    const filterValues = {
      search: this.searchCtrl.value.trim(),
      milk: this.milkCtrl.value
    };
    this.onFilter.emit(filterValues);
  }



  onMilkButtonDeselect(value: string): void {

    if (this.milkCtrl.value === value) {
      this.milkCtrl.setValue(null);
    } else {
      this.milkCtrl.setValue(value);
    }
  }



  resetSearch(): void {
    this.searchCtrl.setValue('');
    this.isSearch = false;
    this.emitFilter();
  }

}
