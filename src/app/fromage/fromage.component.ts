import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fromage',
  imports: [],
  templateUrl: './fromage.component.html',
  styleUrl: './fromage.component.css'
})
export class FromageComponent implements OnInit {

  @Input() fromage: any

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
