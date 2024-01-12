import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Lugar,
  Lugares,
  MisLugares,
  ServicioService,
} from 'src/app/services/servicio.service';

import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Camera, Photo, CameraResultType } from '@capacitor/camera';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  airplane,
  camera,
  trash,
  searchCircle,
} from 'ionicons/icons';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgFor, RouterModule],
})
export class LugaresComponent implements OnInit {
  lugares: Lugares[] = [];
  misLugares: MisLugares[] = [];

  xidSeleccionado: string | undefined = '';
  coctelSeleccionado: MisLugares | undefined = undefined;
  modalLugaresAbierto: boolean = false;
  toastMensaje: string = '';
  modalinput: any;

  constructor(private servicio: ServicioService) {
    addIcons({ addCircleOutline, airplane, camera, trash, searchCircle });
  }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  addnewPlace(xid: string) {
    const lugar = this.lugares.find((x) => x.xid === xid);

    this.servicio.addMisLugares({
      xid: lugar?.xid,
      name: lugar?.name,
      country: lugar?.country,
      imageurl: lugar?.imageurl,
    });
    this.ionViewWillEnter();
  }

  abrirModalLugares(xid?: string) {
    this.modalLugaresAbierto = true;
    this.xidSeleccionado = xid;
  }

  cancel() {
    this.modalLugaresAbierto = false;
  }

  confirm() {
    this.servicio.updateMisLugares(this.modalinput, this.xidSeleccionado);
    this.modalLugaresAbierto = false;
    this.ionViewWillEnter();
  }

  async ionViewWillEnter() {
    this.misLugares = this.servicio.getMisLugares();
    this.lugares = await this.servicio.getRegistro();
  }

  foto: Photo | null = null;

  async sacarFoto() {
    this.foto = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      correctOrientation: true,
    });

    console.log(this.foto);
  }

  eliminarLugar(xid?: string) {
    this.servicio.deleteMisLugares(xid);
  }
}
