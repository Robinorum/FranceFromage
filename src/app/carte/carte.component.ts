import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-carte',
  standalone: true, // Ajout de la propriété standalone
  imports: [], 
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.css'
})
export class CarteComponent implements AfterViewInit {
  
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [46.603354, 1.888334], // Coordonnées centrées sur la France
      zoom: 6 // Niveau de zoom adapté pour voir la France entière
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}