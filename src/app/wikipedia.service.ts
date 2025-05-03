import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {


  httpClient = inject(HttpClient);

  constructor() { }


  getImageFromWikipedia(link_wiki: string, link_wiki_en: string | null): Observable<string | null> {

    //on decoupe les liens pour pouvoir les utiliser dans l'api de wiki

    let link_wiki_sliced = link_wiki.slice(29);
    let link_wiki_en_sliced = ""
    if (link_wiki_en != null) {
      link_wiki_en_sliced = link_wiki_en.slice(29);
    }

    //on fait une requete sur l'api de wikipedia pour recuperer l'image manquante du fromage
    return this.httpClient.get<any>("https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=500&titles=" + link_wiki_sliced + "&origin=*")
      .pipe(
        map(response => {
          //on recupere le lien de l'image en navigant dans le json
          const pages = response?.query?.pages;
          const pageId = Object.keys(pages)[0];
          let result = pages[pageId]?.thumbnail?.source
          return result || null
        }),
        switchMap((imageFr) => {


          //SI il n'y a pas d'image dispo, on va voir sur la page anglaise voir si il y en a une

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

        //et si il y a vraiment rien, on renvoie le placeholder parce que je peux pas faire des miracles non plus
        map((image) => image || "/placeholder.png")
      );

  }
}
