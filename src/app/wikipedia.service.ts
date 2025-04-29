import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {


  httpClient = inject(HttpClient);

  constructor() { }


  getImageFromWikipedia(link_wiki: string, link_wiki_en: string | null): Observable<string | null> {

    let link_wiki_sliced = link_wiki.slice(29);
    let link_wiki_en_sliced = ""
    if (link_wiki_en != null) {
      link_wiki_en_sliced = link_wiki_en.slice(29);
    }

    return this.httpClient.get<any>("https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=500&titles=" + link_wiki_sliced + "&origin=*")
      .pipe(
        map(response => {
          const pages = response?.query?.pages;
          const pageId = Object.keys(pages)[0];
          let result = pages[pageId]?.thumbnail?.source
          return result || null
        }),
        switchMap((imageFr) => {


          if (imageFr != null || link_wiki_en == null) {
            return of(imageFr);
          }

          return this.httpClient.get<any>("https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=500&titles=" + link_wiki_en_sliced + "&origin=*")
            .pipe(
              map((response) => {
                const pages = response?.query?.pages;
                const pageId = Object.keys(pages)[0];
                let result = pages[pageId]?.thumbnail?.source
                return result || null;
              })
            );
        }),
        map((image) => image || "/placeholder.png")
      );

  }
}
