import { Component, inject } from '@angular/core';
import { FromageService } from '../fromage.service';
import { FromageComponent } from '../fromage/fromage.component';
import { Fromage } from '../fromage';


@Component({
  selector: 'app-home',
  imports: [FromageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {

  fromage_random: Fromage | null = null
  fromageService = inject(FromageService)

  constructor() { }

  ngOnInit(): void {
    this.fromageService.getRandomFromage().subscribe(
      data => this.fromage_random = data
    )
  }

}
