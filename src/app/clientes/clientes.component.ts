import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import  swal  from 'sweetalert2';
import {tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  //clientes!:Cliente[] | undefined
  clientes:Cliente[]=[];
  paginador:any;
  clienteSeleccionado:Cliente;


  constructor(private clienteService:ClienteService,
              private activatedRoute:ActivatedRoute,
              private modalService:ModalService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page')!;

    console.log('numero:'+ page);
    //this.clientes=CLIENTES;
    //this.clientes=this.clienteService.getClientes();
    this.clienteService.getClientes(page).pipe(
      tap( response => {
        console.log('ClientesComponent: tap 3');
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      })
    ).subscribe(
      //clientes=>this.clientes=clientes
      respuesta=>{
      this.clientes=respuesta.content as Cliente[];
      this.paginador=respuesta;
      });
    });
    this.modalService.notificarUpload.subscribe( cliente => {
        this.clientes=this.clientes.map(clienteOriginal => {
          if(cliente.id==clienteOriginal.id)
          {
            clienteOriginal.foto=cliente.foto;
          }
          return clienteOriginal;
        })
    });
    console.log('los elementos son ::'+this.clientes.length);
  }

  delete(cliente:Cliente):void{
    if(this.clientes.length&&this.clientes){
      console.log('es::'+this.clientes.length);
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: `Seguro que quieres eliminar el ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe(
            response =>{
              this.clientes= this.clientes?.filter(cli =>cli !==cliente)
              swalWithBootstrapButtons.fire(
                'Cliente Eliminado!',
                `Cliente ${cliente.nombre} eliminado con exito!`,
                'success'
              )
            }
          )
      }
    })
  }else
  {
    console.log('hola');
  }
    }

  abrirModal(cliente:Cliente)
  {
    this.clienteSeleccionado=cliente;
    this.modalService.abrirModal();
    console.log('hasta aki va bien');
  }
}
