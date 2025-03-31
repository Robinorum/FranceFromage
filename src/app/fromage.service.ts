import { HttpClient } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
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
          this.wikipediaService.getImageFromWikipedia(el.page_francaise).pipe(
            map(imageUrl => ({
              name: el.fromage,
              departement: el.departement,
              wiki_page: el.page_francaise,
              milk: el.lait,
              image: imageUrl
            }))
          )
    );
  
  return forkJoin<Fromage[]>(fromageObservables);  }
      
  )
  );
  }
}
