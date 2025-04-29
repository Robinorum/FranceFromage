import { Component, inject, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { FromageService } from '../fromage.service';
import { Fromage } from '../fromage';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jeudufromage',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './jeudufromage.component.html',
  styleUrl: './jeudufromage.component.css'
})

export class JeudufromageComponent implements AfterViewInit {
  fromage_random: Fromage | null = null;
  fromageService = inject(FromageService);
  words: string[] = [];
  guessedLetters: string[][] = [];
  isCorrect: boolean = false;
  message: string = '';
  hintState: number = 0;

  @ViewChildren('letterInput') letterInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor() { }

  ngOnInit(): void {
    this.fromageService.getRandomFromage().subscribe(
      data => {
        this.fromage_random = data;
        this.words = data.name.split(/\s+/).filter(word => word.length > 0);
        this.guessedLetters = this.words.map(word => new Array(word.length).fill(''));
      }
    );
  }

  ngAfterViewInit(): void { }

  focusNextInput(wordIndex: number, letterIndex: number): void {
    const inputs = this.letterInputs.toArray();
    const totalInputsBefore = this.words
      .slice(0, wordIndex)
      .reduce((sum, word) => sum + word.length, 0);
    const currentInputIndex = totalInputsBefore + letterIndex;

    if (currentInputIndex < inputs.length - 1) {
      inputs[currentInputIndex + 1].nativeElement.focus();
    }
  }

  checkAnswer(): void {
    const userGuess = this.guessedLetters
      .map(wordLetters => wordLetters.join(''))
      .join(' ')
      .toLowerCase();
    const correctName = this.fromage_random?.name.toLowerCase() || '';
    if (userGuess === correctName) {
      this.isCorrect = true;
      this.message = 'Bravo !';
    } else {
      this.isCorrect = false;
      this.message = 'Incorrect, essayez encore !';
    }
  }

  showIndice(): void {
    if (this.hintState < 2) {
      this.hintState++;
    }
  }
}