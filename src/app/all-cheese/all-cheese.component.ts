import { Component, inject, OnInit } from '@angular/core';
import { FromageService } from '../fromage.service';
import { FromageComponent } from '../fromage/fromage.component';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-all-cheese',
  imports: [FromageComponent, FilterComponent],
  templateUrl: './all-cheese.component.html',
  styleUrl: './all-cheese.component.css'
})
export class AllCheeseComponent implements OnInit {

  fromages = <any>[]
  fromageService = inject(FromageService)

  constructor() { }

  ngOnInit(): void {
    this.fromageService.getFromages().subscribe(
      data => this.fromages = data
    )
  }


}
