import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {


  httpClient = inject(HttpClient);

  constructor() { }


  getImageFromWikipedia(link_wiki:string): Observable<string | null>{

    let link_wiki_sliced = link_wiki.slice(29);

    return this.httpClient.get<any>("https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=500&titles="+link_wiki_sliced+"&origin=*")
    .pipe(
      map(response => {
        const pages = response?.query?.pages;
        const pageId = Object.keys(pages)[0];
        return pages[pageId]?.thumbnail?.source || "/placeholder.png";
      })
    );

  }
}
