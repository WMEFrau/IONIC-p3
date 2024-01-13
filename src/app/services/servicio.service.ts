import { Injectable } from '@angular/core';
import { bus } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  // ARREGLOS PARA ALMACENAR LOS VALORES DE MANERA PERMANENTE
  lugares: Lugares[] = [];
  mislugares: MisLugares[] = [];

  constructor() {}

  private _baseUrl = 'http://api.opentripmap.com/0.1/';
  apikey = '5ae2e3f221c38a28845f05b6f9b75e642de6b2ae386eaf2dcd9a68ca';
  name = 'teatro';

  // FUNCION PARA OBTENER LISTADO DE LUGARES DESDE API
  async getAutosuggest(): Promise<Lugar[]> {
    console.log(this.name);
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

  // FUNCION PARA OBTENER UN LUGAR ESPECIFICO POR ID DESDE API
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

  // FUNCION PARA AGREGAR REGISTRO A LISTA LUGARES "PARA AGREGAR"
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

  // FUNCION QUE OBTIENE LISTA DE LUGARES PARA AGREGAR DESDE API / SE AÑADE PARAMETRO PARA BUSQUEDA DE LUGAR
  async getRegistro(busqueda: string): Promise<Lugares[]> {
    this.lugares = [];
    console.log('getregistro', busqueda);
    if (busqueda && busqueda.trim() !== '') {
      this.name = busqueda;
    }

    const res = await this.getAutosuggest();
    res.forEach(async (element) => {
      this.lugares.push(await this.getRegistroDetalle(element.xid));
    });

    return this.lugares;
  }

  // FUNCION PARA AGREGAR REGISTRO A LISTA MISLUGARES / SE AÑADE MENSAJE DE RESPUESTA
  addMisLugares(milugar: MisLugares): { mensaje: string; tipo: string } {
    var existe = this.mislugares.find((x) => x.xid === milugar.xid);
    if (!existe) {
      this.mislugares.push(milugar);
      return { mensaje: 'Añadido a la lista correctamente', tipo: 'success' };
    } else {
      return { mensaje: 'Registro ya existe en la lista', tipo: 'warning' };
    }
  }

  // FUNCION PARA RETORNAR LISTA MISLUGARES
  getMisLugares() {
    return this.mislugares;
  }

  // FUNCION PARA ACTUALIZAR PRECIO DEL LISTA MISLUGARES / SE AÑADE MENSAJE DE RESPUESTA
  updateMisLugares(
    valor: number,
    xid: string | undefined
  ): { mensaje: string; tipo: string } {
    var msg: string = '';
    var tipo: string = '';
    this.mislugares.forEach((objeto) => {
      if (objeto.xid === xid) {
        objeto.precio = valor;
        msg = 'Precio actualizado correctamente';
        tipo = 'success';
      }
    });
    if (!msg) {
      msg = 'Imagen no pudo ser actualizada';
      tipo = 'warning';
    }

    return { mensaje: msg, tipo: tipo };
  }

  // FUNCION PARA ELIMINAR DE LISTA MISLUGARES / SE AÑADE MENSAJE DE RESPUESTA
  deleteMisLugares(xid?: string): { mensaje: string; tipo: string } {
    const index = this.mislugares.findIndex((objeto) => objeto.xid === xid);
    // Si se encuentra el objeto, elimínalo de la lista
    if (index !== -1) {
      this.mislugares.splice(index, 1);
      return {
        mensaje: 'Registro fue eliminado correctamente',
        tipo: 'success',
      };
    } else {
      return { mensaje: 'Registro no pudo ser eliminado', tipo: 'warning' };
    }
  }

  // FUNCION PARA ACTUALIZAR IMAGEN DEL LISTA MISLUGARES / SE AÑADE MENSAJE DE RESPUESTA
  updateIMGMisLugares(
    imagePath: string | undefined,
    xid: string | undefined
  ): { mensaje: string; tipo: string } {
    var msg: string = '';
    var tipo: string = '';
    this.mislugares.forEach((objeto) => {
      if (objeto.xid === xid) {
        objeto.imageurl = imagePath;
        msg = 'Imagen actualizada correctamente';
        tipo = 'success';
      }
    });

    if (!msg) {
      msg = 'Imagen no pudo ser actualizada';
      tipo = 'warning';
    }

    return { mensaje: msg, tipo: tipo };
  }
} // fin clase servicio

// ENTIDADES PARA FUNCIONAMIENTO DE LA APP

// INTERFASE PARA LISTA DE LUGARES PARA AGREGAR
export interface Lugares {
  xid: string;
  name: string;
  country: string;
  imageurl: string;
}

// INTERFASE PARA LISTA DE LUGARES AGREGADOS
export interface MisLugares {
  xid?: string;
  name?: string;
  country?: string;
  imageurl?: string;
  precio: number;
}

// ENTIDADES PARA APIS

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
