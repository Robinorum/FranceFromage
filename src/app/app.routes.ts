import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllCheeseComponent } from './all-cheese/all-cheese.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: HomeComponent},
    { path: 'allcheese', component: AllCheeseComponent}
];

