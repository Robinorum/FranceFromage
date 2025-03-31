import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  laitVisible: boolean = false;

  toggleLait() {
    this.laitVisible = !this.laitVisible;
  }

}
