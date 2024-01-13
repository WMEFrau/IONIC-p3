import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Lugar,
  Lugares,
  MisLugares,
  ServicioService,
} from 'src/app/services/servicio.service';

import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
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
  // ARREGLOS VACIOS PARA MOSTRAR EN PANTALLA
  lugares: Lugares[] = [];
  misLugares: MisLugares[] = [];
  busqueda: string = '';

  xidSeleccionado: string | undefined = ''; // ID DE LA LISTA PARA EL MODAL
  modalLugaresAbierto: boolean = false; // VARIABLE QUE INDICA CUANDO DEBE MOSTRARSE/OCULTARSE EL MODAL
  toastMensaje: string = ''; // SE UTILIZARA PARA MOSTRAR MENSAJE CON ACCIONES ** AUN SIN APLICAR
  modalinput: any; // INPUT DEL MODAL -> SE CAPTURA EL VALOR

  constructor(
    private servicio: ServicioService,
    private toastController: ToastController
  ) {
    addIcons({ addCircleOutline, airplane, camera, trash, searchCircle });
  }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  // ACCION BOTON + -> AGREGAR REGISTRO A LISTA MISLUGARES
  addnewPlace(xid: string) {
    const lugar = this.lugares.find((x) => x.xid === xid);

    var respuesta = this.servicio.addMisLugares({
      xid: lugar?.xid,
      name: lugar?.name,
      country: lugar?.country,
      imageurl: lugar?.imageurl,
    });

    this.mostrarToast(respuesta.mensaje, respuesta.tipo);

    //this.ionViewWillEnter();
  }

  // ACCION AL APRETAR AVION -> ABRIR MODAL Y CAPTURAR ID SELECCIONADO
  abrirModalLugares(xid?: string) {
    this.modalLugaresAbierto = true;
    this.xidSeleccionado = xid;
  }

  // ACCIONES AL CERRAR MODAL -> QUITAR MODAL DE PANTALLA
  cancel() {
    this.modalLugaresAbierto = false;
  }

  // ACCIONES AL CONFIRMAR MODAL -> MODIFICAR PRECIO / SE AÑADE MENSAJE DE RESPUESTA
  confirm() {
    var respuesta = this.servicio.updateMisLugares(
      this.modalinput,
      this.xidSeleccionado
    );
    this.modalLugaresAbierto = false;
    this.mostrarToast(respuesta.mensaje, respuesta.tipo);
  }

  //  RECARGA DE LISTADOS AL INICIAR O REALIZAR CAMBIOS
  async ionViewWillEnter() {
    this.misLugares = this.servicio.getMisLugares();
    this.lugares = await this.servicio.getRegistro(this.busqueda);
  }

  // ACCION BOTON ELIMINAR -> ELIMINAR EL REGISTRO DEL LISTADO MISLUGARES / SE AÑADE MENSAJE DE RESPUESTA
  eliminarLugar(xid?: string) {
    var respuesta = this.servicio.deleteMisLugares(xid);
    this.mostrarToast(respuesta.mensaje, respuesta.tipo);
  }

  // SE UTILIZARA PARA CAPTURAR IMAGEN Y ACTUALIZAR REGISTRO EN LA LISTA / SE AÑADE MENSAJE DE RESPUESTA
  foto: Photo | null = null;
  async sacarFoto(xid: string | undefined) {
    this.foto = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      correctOrientation: true,
    });

    var respuesta = this.servicio.updateIMGMisLugares(this.foto.webPath, xid);
    this.mostrarToast(respuesta.mensaje, respuesta.tipo);
  }

  // FUNCION PARA REALIZAR NUEVA BUSQUEDA EN EL API
  async buscarLugar(event: any) {
    this.busqueda = event.target.value;
    if (event.target.value !== '') {
      this.lugares = await this.servicio.getRegistro(this.busqueda);
    }
  }

  // MENSAJE DE RESPUESTA DINAMICO
  async mostrarToast(mensaje: string, tipo: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: tipo,
    });
    await toast.present();
  }
}
