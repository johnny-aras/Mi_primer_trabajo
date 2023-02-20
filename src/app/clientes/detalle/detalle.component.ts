import { Component, OnInit, Input } from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../cliente.service';
import {ModalService} from './modal.service';
import {ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente:Cliente;
  titulo="Detalle del cliente";
  progreso:number =0;
  private imagenSeleccionada!:File;
  modalService:ModalService;
  constructor(private clienteService:ClienteService,
              private activatedRoute:ActivatedRoute,
               modalService:ModalService) {
               this.modalService=modalService;  }

  ngOnInit(){}
  /*ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id:number=+params.get('id')!;
      if(id)
      {
          this.clienteService.getCliente(id).subscribe( cliente =>
            this.cliente=cliente
          );
      }
    });
  }*/

  seleccionarFoto(event:any)
  {
      this.imagenSeleccionada=event.target.files[0];
      this.progreso =0;
      console.log(this.imagenSeleccionada);
      if(this.imagenSeleccionada.type.indexOf('image')<0)
      {
        this.imagenSeleccionada =null;
        swal.fire('Error al Seleccionar la imagen','El archivo debe ser del tipo imagen', 'error');
      }
  }

    subirFoto()
    {
      if(!this.imagenSeleccionada)
      {
          swal.fire('Error Upload','Debe seleccionar una foto', 'error');
      }else{
        this.clienteService.subirFoto(this.imagenSeleccionada,this.cliente.id).subscribe(
        //cliente => {
        event => {
          if(event.type ===HttpEventType.UploadProgress)
          {
            this.progreso=Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response)
          {
            let response:any = event.body;
            this.cliente= response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            //swal.fire('La imagen se ha subido correctamente',`La imagen se ha subido con exito: ${this.cliente.foto}`,'success');
            swal.fire('La imagen se ha subido correctamente',response.mensaje,'success');
          }
        //this.cliente=cliente;
      });
    }
    }

    cerrarModal(){
      this.modalService.cerrarModal();
      this.imagenSeleccionada=null;
      this.progreso =0;
    }
}
