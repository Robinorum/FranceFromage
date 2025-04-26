import { HttpClient } from '@angular/common/http';
import { inject,Injectable} from '@angular/core';
import { Fromage } from './fromage';
import { map, switchMap, Observable, of, tap, forkJoin } from 'rxjs';
import { WikipediaService } from './wikipedia.service';


@Injectable({

  providedIn: 'root'

})

export class FromageService {

  httpClient = inject(HttpClient);
  wikipediaService = inject(WikipediaService)

  constructor() { }
  
  getFromages():Observable<Fromage[]>{

    return this.httpClient.get<any>('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/fromagescsv-fromagescsv/records?limit=-1')
    .pipe(
      map(
        (data: any) => data.results
      ),
      switchMap(fromages =>{
        const fromageObservables = fromages.map((el: any) => 
          this.wikipediaService.getImageFromWikipedia(el.page_francaise, el.english_page).pipe(
            map(imageUrl => ({
              name: el.fromage,
              departement: el.departement,
              wiki_page: el.page_francaise,
              wiki_page_en : el.english_page,
              milk: el.lait,
              image: imageUrl
            }))
          )
    );
  
  return forkJoin<Fromage[]>(fromageObservables);  }
      
  )
  );
  }



  getRandomFromage(): Observable<Fromage> {
    return this.getFromages()
    .pipe(
      map((fromages: Fromage[]) => {
        const randomValue = Math.floor(Math.random() * fromages.length);
        return fromages[randomValue];
      })
    );
  }


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



  getFromagesMilk(milk: string | null): Observable<Fromage[]> {
    return this.getFromages()
    .pipe(
      map((fromages: Fromage[]) =>
        milk
          ? fromages.filter((fromage) =>
              fromage.milk.map((m) => m.toLowerCase()).includes(milk.toLowerCase())
            )
          : fromages
      )
    );
  }


  getFromagesFiltres(search: string, milk: string | null): Observable<Fromage[]> {

    if (!search && !milk) {
      return this.getFromages();
    }

    
    const nameFiltre = search ? this.getFromageContains(search) : this.getFromages();
    const milkFiltre = milk ? this.getFromagesMilk(milk) : this.getFromages();

    
    return forkJoin([nameFiltre, milkFiltre]).pipe(
      map(([nameFiltered, milkFiltered]) => {
   
        return nameFiltered.filter((fromage) =>
          milkFiltered.some((milkFromage) => milkFromage.name === fromage.name)
        );
      })
    );
  }



}
