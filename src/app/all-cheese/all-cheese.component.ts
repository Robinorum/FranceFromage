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
  isLoading: boolean=false

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
    this.fromageService.getFromages().subscribe({
      next: (data) =>{
        this.fromages=data;
        this.isLoading=false;
      },

      error: () => {
        this.fromages=[];
        this.isLoading=false;
      }
    }
    
    )
  }


  onFilter(filter:{ search: string; milk: string | null }): void {
    this.isLoading=true;
    this.fromageService.getFromagesFiltres(filter.search,filter.milk).subscribe({
      next: (data) =>{
        this.fromages=data;
        this.isLoading=false;
      },

      error: () => {
        this.fromages=[];
        this.isLoading=false;
      }
    }

    )
  }


}
