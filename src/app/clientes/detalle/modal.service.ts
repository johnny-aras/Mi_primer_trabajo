import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {


  private _notificarUpload = new EventEmitter<any>();
  modal:boolean = false;
  constructor() { }

  abrirModal()
  {
    this.modal = true;
  }

  cerrarModal()
  {
    this.modal = false;
  }

  get notificarUpload():EventEmitter<any>{
      return this._notificarUpload;
  }

}
