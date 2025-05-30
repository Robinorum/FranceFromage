import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Fromage } from './fromage';
import { map, switchMap, Observable, forkJoin } from 'rxjs';
import { WikipediaService } from './wikipedia.service';


@Injectable({

  providedIn: 'root'

})

export class FromageService {

  httpClient = inject(HttpClient);
  wikipediaService = inject(WikipediaService)

  constructor() { }

  getFromages(): Observable<Fromage[]> {

    return this.httpClient.get<any>('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/fromagescsv-fromagescsv/records?limit=-1') 
    //impossible de recuperer TOUTES les données, max 100 avec ce lien
      .pipe(
        map(
          (data: any) => data.results
        ),
        //on construit un tableau d'observables avec le switchMap
        switchMap(fromages => {
          //on fait un map sur chaque fromage pour lancer getImageFromWikipedia
          const fromageObservables = fromages.map((el: any) =>
            //la fonction permet de recuperer une image pour le fromage -> cf le commentaire sur wikipedia.service.ts
            this.wikipediaService.getImageFromWikipedia(el.page_francaise, el.english_page)
            //ça renvoie un observable de l'image dans faut faire attention a forkJoin après
              .pipe(
                map(imageUrl => ({
                  name: el.fromage,
                  departement: el.departement,
                  wiki_page: el.page_francaise,
                  wiki_page_en: el.english_page,
                  milk: el.lait[0],
                  image: imageUrl,
                }))
              )
          );

          //on ATTENDS que tout les observables soient terminés sinon pas content
          return forkJoin<Fromage[]>(fromageObservables);
        }),

        //FILTRAGE pour eviter les doublons, parce que la bdd est absolument ignoble

        map((fromages: Fromage[]) => {
          const seenNames = new Set<string>();
          return fromages.filter(fromage => {
            if (seenNames.has(fromage.name)) {
              return false; //on prend pas
            }
            seenNames.add(fromage.name);
            return true;//on prend
          });
        })
      );
  }



  getRandomFromage(): Observable<Fromage> {
    return this.getFromages()
      .pipe(
        map((fromages: Fromage[]) => {
          //on recuperer un index au hasard et hop on recupere le fromage
          const randomValue = Math.floor(Math.random() * fromages.length);
          return fromages[randomValue];
        })
      );
  }

//fonction contains, comme dans le tp cocktail
  getFromageContains(search: string): Observable<Fromage[]> {
    return this.getFromages()
      .pipe(
        map((fromages: Fromage[]) =>
          fromages.filter((fromage) =>
            fromage.name.toLowerCase().startsWith(search.toLowerCase())
          )
        )
      );
  }


//recuperer les fromages en fonction du type de lait
  getFromagesMilk(milk: string | null): Observable<Fromage[]> {
    return this.getFromages().pipe(
      map((fromages: Fromage[]) =>
        milk
          ? fromages.filter((fromage) =>
              fromage.milk.toLowerCase() === milk.toLowerCase()
            )
          : fromages
      )
    );
  }


  //fonction qui combine les deux autres, si on a pas de filtre on renvoie tous les fromages

//Je sais, j'aurais pu faire une seule fonction pour checker le type de fromage en l'input en meme temps
//mais j'ai prefere separer les deux, je trouve ça plus clair, et ça se rapproche plus de ce que l'on a fait en tp
//en plus c'est modulaire, si un jour je veux supprimer les boutons radio pour le type de lait, j'ai pas besoin de modifier tout

//cependant, avec cette approche, j'ai deux appels à getFromages :(

  getFromagesFiltres(search: string, milk: string | null): Observable<Fromage[]> {

    if (!search && !milk) { //si y a rien, on renvoie juste tout les fromages
      return this.getFromages();
    }


    const nameFiltre = search ? this.getFromageContains(search) : this.getFromages();
    const milkFiltre = milk ? this.getFromagesMilk(milk) : this.getFromages();


    return forkJoin([nameFiltre, milkFiltre]).pipe( //encore une fois on attends que toutes les fromages soit filtés avec de .pipe
      map(([nameFiltered, milkFiltered]) => {

        return nameFiltered.filter((fromage) =>
          milkFiltered.some((milkFromage) => milkFromage.name === fromage.name) //on match ensemble les fromages identiques dans namefiltre et milkfiltre
        );
      })
    );
  }



}
