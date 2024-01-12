import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  lugares: Lugares[] = [];
  mislugares: MisLugares[] = [];

  constructor() {}

  private _baseUrl = 'http://api.opentripmap.com/0.1/';
  apikey = '5ae2e3f221c38a28845f05b6f9b75e642de6b2ae386eaf2dcd9a68ca';
  name = 'teatro';

  async getAutosuggest(): Promise<Lugar[]> {
    const path =
      'en/places/autosuggest?format=json&name=' +
      this.name +
      '&radius=300000&lat=-36.8173&lon=-73.0373&apikey=' +
      this.apikey +
      '&limit=3';
    const url = `${this._baseUrl}${path}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // : Promise<Lugares[]>

  async getXid(xid: string): Promise<LugarDetalle> {
    const path = 'en/places/xid/' + xid + '?apikey=' + this.apikey;
    const url = `${this._baseUrl}${path}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getRegistroDetalle(xid: string): Promise<Lugares> {
    const res = await this.getXid(xid);
    return {
      xid: res.xid,
      name: res.name,
      country: res.address.country,
      imageurl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp9LPDHi6Tj1EkewCO9yQIjsdjGNZU7rL4RdAELxHYFxAEH2uxc0tCig7HbIrueBpjqYY&usqp=CAU',
    };
  }

  async getRegistro(): Promise<Lugares[]> {
    this.lugares = [];
    const res = await this.getAutosuggest();
    res.forEach(async (element) => {
      this.lugares.push(await this.getRegistroDetalle(element.xid));
    });

    return this.lugares;
  }

  addMisLugares(milugar: MisLugares) {
    this.mislugares.push(milugar);
  }

  getMisLugares() {
    return this.mislugares;
  }

  updateMisLugares(valor: number, xid: string | undefined) {
    console.log(xid, valor);
    this.mislugares.forEach((objeto) => {
      if (objeto.xid === xid) {
        objeto.precio = valor;
      }
    });
  }

  deleteMisLugares(xid?: string) {
    const index = this.mislugares.findIndex((objeto) => objeto.xid === xid);

    // Si se encuentra el objeto, elimínalo de la lista
    if (index !== -1) {
      this.mislugares.splice(index, 1);
    }
  }
} // fin clase servicio

export interface Lugares {
  xid: string;
  name: string;
  country: string;
  imageurl: string;
}

export interface MisLugares {
  xid?: string;
  name?: string;
  country?: string;
  imageurl?: string;
  precio?: number;
}

// API getAutosuggest
export interface Lugar {
  xid: string;
  name: string;
  highlighted_name: string;
  dist: string;
  rate: string;
  osm: string;
  wikidata: string;
  kinds: string;
  point: {
    lon: string;
    lat: string;
  };
}

// API XID
export interface LugarDetalle {
  xid: string;
  name: string;
  address: {
    city: string;
    road: string;
    state: string;
    county: string;
    suburb: string;
    country: string;
    postcode: string;
    country_code: string;
    neighbourhood: string;
  };
  rate: string;
  osm: string;
  bbox: {
    lon_min: string;
    lon_max: string;
    lat_min: string;
    lat_max: string;
  };
  wikidata: string;
  kinds: string;
  url: string;
  sources: {
    geometry: string;
    attributes: string[];
  };
  otm: string;
  wikipedia: string;
  image: string;
  preview: {
    source: string;
    height: string;
    width: string;
  };
  wikipedia_extracts: {
    title: string;
  };
  point: {
    lon: string;
    lat: string;
  };
}