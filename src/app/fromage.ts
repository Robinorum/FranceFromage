export interface Fromage {
    name : string
    wiki_page : string
    wiki_page_en : string
    departement : string
    milk : Array<string>
    geo_shape?: GeoShape;
}


export interface GeoShape {
    type: string;
    geometry: {
      coordinates: number[][][][];
      type: string;
    };
    properties: any;
  }