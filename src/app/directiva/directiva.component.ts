import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {


  listadoCursos:Object[]=['PHP','Typescript','C#','Java','Python'];
  habilitar:boolean=true;
  constructor() { }

  ngOnInit(): void {
  }

}
