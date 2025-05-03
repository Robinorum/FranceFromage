import { Component, inject, AfterViewInit } from '@angular/core';
import { FromageService } from '../fromage.service';
import { Fromage } from '../fromage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jeudufromage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jeudufromage.component.html',
  styleUrl: './jeudufromage.component.css'
})
export class JeudufromageComponent implements AfterViewInit {
  fromage_random: Fromage | null = null;
  fromageService = inject(FromageService);
  words: string[] = [];
  guessedLetters: string[][] = []; //la fameuse matrice dont je parlais dans le html, pour suivre les lettres inscrites dans les inputs, en fonction des mots et de la position de la lettre dans le mot
  isCorrect: boolean = false;
  message: string = '';
  hintNumber: number = 0;
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.loadNewFromage();
  }

  ngAfterViewInit(): void {}

  private loadNewFromage(): void {
    this.isLoading = true;
    this.fromageService.getRandomFromage().subscribe( //on initialise toutes les variables, et on recup le fromage aleatoire
      data => {
        this.fromage_random = data;
        this.words = data.name.split(' ').filter(word => word.length > 0); //on separe chaque mots
        this.guessedLetters = this.words.map(word => new Array(word.length).fill('')); //on set la matrice pour chaque mot
        this.hintNumber = 0;
        this.isCorrect = false;
        this.message = '';
        this.isLoading = false;
      }
    );
  }

  onLetterInput(event: Event, wordIndex: number, letterIndex: number): void {
    const input = event.target as HTMLInputElement; //POUR RECUPERER LA LETTRE ENTRéE --> recupere l'input a partir de l'event passé en parametre (dans notre cas, ça recupere la lettre rentrée)
    const value = input.value.toLowerCase(); //on rend tout ça insensible a la casse
    this.guessedLetters[wordIndex][letterIndex] = value.length > 1 ? value.charAt(0) : value; //on insere la lettre au bon mot, et au bon index
  }

  checkAnswer(): void {
    const userGuess = this.guessedLetters
      .map(wordLetters => wordLetters.join('')) //on merge les lettres et les mots pour comparer a la reponse
      .join(' ')
      .toLowerCase();
    if (userGuess === this.fromage_random?.name.toLowerCase()) {
      this.isCorrect = true;
      this.message = 'Bravo ! Vous êtes un vrai fromageur';
    } else {
      this.isCorrect = false;
      this.message = "Incorrect, révisez vos fromages !";
    }
  }

  showIndice(): void {  //seulement une variable qui s'incremente au clic du bouton, et qui agit sur la photo du fromage dans le html
    if (this.hintNumber < 2) {
      this.hintNumber++;
    }
  }

  Reset(): void { //quand le user clique sur un nouveau fromage, on cherche un nouveau fromage random
    this.loadNewFromage();
  }
}