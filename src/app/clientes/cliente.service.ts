import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.js';
import {formatDate,DatePipe} from '@angular/common';

import { Cliente } from './cliente';
import {map,catchError, tap} from  'rxjs/operators';
import { Observable , of , throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import swal from 'sweetalert2';

import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  private httpHeaders= new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http:HttpClient,
              private router:Router) { }

  getClientes(page:number):Observable<any>
  {
    //ultima implementacion valida
    //return of(CLIENTES);
    //return CLIENTES;
    //PRIMERA IMPLEMENTACION DEL METODO!!!
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    //OTRA implementacion
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
    tap((response:any) => {

      console.log('ClienteService: tap 1');
      let clientess=response.content as Cliente[];
      console.log(clientess);
      (clientess).forEach( cliente =>
        console.log(cliente.nombre)
      );
    }),
    map(response => {
      //let clientes= response as Cliente[];
      console.log('hasta ki');
      (response.content as Cliente[]).map(cliente =>
        {
          cliente.nombre= cliente.nombre.toUpperCase();

          //registerLocaleData(localeES,'es');
          let datePipe = new DatePipe('es');
          // se determina que la respuesta sea estrictamente un string puesto que puede devolver un null o string
          //tenemos el caso de agregarle el operador ! al final de la instruccion antess del ;
          //para decirle a TS que estas seguro que nunca va a venir un null en esta instruccion.

          //cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy') as string;
          //cliente.createAt = datePipe.transform(cliente.createAt,'dd/MM/yyyy') as string ;//formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        });
        return response;
    }),
    tap(response => {
      console.log('ClienteService tap 2');
      (response.content as Cliente[]).forEach( cliente =>
        {
          console.log(cliente.nombre);
      }
      );
    })
    );
  }
  getCliente(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje,'error');
        return throwError(()=> e);
      })
    );
  }
  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
      map( (response:any) => response.cliente as Cliente ),
      catchError(e => {
        if(e.status ==400)
        {
          return throwError(() => e);
        }
        console.error(e.error.mensaje);
        //swal.fire('Error al crear el cliente',e.error.mensaje,'error');
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(() => e);
      })
    );
  }
  update(cliente:Cliente):Observable<any>
  {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status ==400)
        {
          return throwError(() => e);
        }
        console.error(e.error.mensaje);
        //swal.fire('Error al actualizar el  cliente',e.error.mensaje,'error');
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(() => e);
      })
    );
  }
  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        //swal.fire('Error al eliminar al cliente',e.error.mensaje,'error');
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(() => e);
      })
    );
  }

  subirFoto(archivo:File, id:number):Observable<HttpEvent<{}>>{
    let formData=new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id.toString());

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData ,{
      reportProgress: true
    });

    /*return this.http.post(`${this.urlEndPoint}/upload`,formData).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );*/
    return this.http.request(req);
  }
}
  
