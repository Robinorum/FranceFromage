import { Component, inject, OnInit } from '@angular/core';
import { FromageService } from '../fromage.service';
import { FromageComponent } from '../fromage/fromage.component';

@Component({
  selector: 'app-home',
  imports: [FromageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit{

  fromages = <any>[]
  fromageService = inject(FromageService)

  constructor() { }

  ngOnInit(): void {
    this.fromageService.getFromages().subscribe(
      data => this.fromages = data
    )
  }


}
