import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import {LoadingProvider} from "../../providers/loading/loading";

/**
 * Generated class for the PosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pos',
  templateUrl: 'pos.html',
})

export class PosPage {
  test:any = {};
  Date1:any = new Date().toJSON().slice(0,10);
  Date2:any = new Date().toJSON().slice(0,10);
  fechas:any = [{id:1,name:'01/07'},{id:2,name:'02/07'},{id:3,name:'03/07'},{id:4,name:'04/07'},{id:5,name:'05/07'}];
  articulos:any = [{id:1,name:'Cucuruchos'},{id:2,name:'Granel'},{id:3,name:'Postres'}, {id:4,name:'Bombones'},{id:5,name:'Especiales'}];
  ventas:any = [{id:1,articulo:'Cucuruchos',  values:[334,382,852,154,674]},
                {id:2,articulo:'Granel',      values:[438,248,757,951,732]},
                {id:3,articulo:'Postres',     values:[634,921,102,873,72]},
                {id:4,articulo:'Bombones',    values:[514,66,346,542,671]},
                {id:5,articulo:'Especiales',  values:[209,514,380,360,544]}];
  regiones:any = [{id:1,name:'NOA'},{id:2,name:'Centro'},{id:3,name:'NEA'}, {id:4,name:'Cuyo'},{id:5,name:'Patagonia'}];
  ventasRegion:any = [{id:1,articulo:'NOA',       values:[84,401,626,71,490]},
                      {id:2,articulo:'Centro',    values:[78,116,106,443,468]},
                      {id:3,articulo:'NEA',       values:[391,477,672,257,712]},
                      {id:4,articulo:'Cuyo',      values:[359,258,804,769,439]},
                      {id:5,articulo:'Patagonia', values:[644,983,617,737,884]}];
  sucursales:any = [{id:1,name:'Centro'},{id:2,name:'Cerro'},{id:3,name:'Alta Cba'}, {id:4,name:'Marques'},{id:5,name:'Jardin'}];
  ventasSucursales:any = [{id:1,articulo:'Centro',    values:[190,797,676,931,482]},
                          {id:2,articulo:'Cerro',     values:[358,621,230,728,382]},
                          {id:3,articulo:'Alta Cba',  values:[537,123,237,140,135]},
                          {id:4,articulo:'Marques',   values:[749,864,719,932,873]},
                          {id:5,articulo:'Jardin',    values:[112,412,498,890,670]}];

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('lineCanvasRegion') lineCanvasRegion;
  @ViewChild('lineCanvasSucursal') lineCanvasSucursal;
  @ViewChild('lineCanvasArticulo') lineCanvasArticulo;

  barChart: any;
  doughnutChart: any;
  lineChart: any;
  lineChartRegion:any;
  lineChartSucursal:any;
  lineChartArticulo:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingProvider: LoadingProvider) {
    this.loadingProvider.loadingPresent();
  }

  ionViewDidLoad() {
    let fecha = [];
    for(let i in this.fechas){
      fecha.push(this.fechas[i].name)
    }
    let articulo = [];
    for(let i in this.articulos){
      articulo.push(this.articulos[i].name)
    }
    let region = [];
    for(let i in this.regiones){
      region.push(this.regiones[i].name)
    }



    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: articulo,
        datasets: [{
          data: [2396, 3126, 2602, 2139, 2007],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(245, 61, 61, 0.2)',
            'rgba(26, 155, 97, 0.2)',
            'rgba(240, 147, 0, 0.2)',
            'rgba(123, 31, 162, 0.2)'
          ],
          hoverBackgroundColor: [
            "#4bc0c0",
            "#f53d3d",
            "#1a9b61",
            "#f09300",
            "#7b1fa2"
          ]
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: fecha,
        datasets: [
          {
            label: this.ventas[0].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "#4bc0c0",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#4bc0c0",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#4bc0c0",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventas[0].values,
            spanGaps: false,
          },
          {
            label: this.ventas[1].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#f98f8f",
            borderColor: "#f53d3d",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#f53d3d",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#f98f8f",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventas[1].values,
            spanGaps: false,
          },
          {
            label: this.ventas[2].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#23ffad",
            borderColor: "#1a9b61",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#1a9b61",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#23ffad",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventas[2].values,
            spanGaps: false,
          },
          {
            label: this.ventas[3].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#ffbc00",
            borderColor: "#f09300",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#f09300",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#ffbc00",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventas[3].values,
            spanGaps: false,
          },
          {
            label: this.ventas[4].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#d531e9",
            borderColor: "#7b1fa2",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#7b1fa2",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#d531e9",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventas[4].values,
            spanGaps: false,
          }
        ]
      }

    });

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: region,
        datasets: [{
          label: '# de Ventas',
          data: [1672,1211,2509,2629,3865],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(245, 61, 61, 0.2)',
            'rgba(26, 155, 97, 0.2)',
            'rgba(240, 147, 0, 0.2)',
            'rgba(123, 31, 162, 0.2)'
          ],
          borderColor: [
            "#4bc0c0",
            "#f53d3d",
            "#1a9b61",
            "#f09300",
            "#7b1fa2"
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }

    });

    this.lineChartRegion = new Chart(this.lineCanvasRegion.nativeElement, {
      type: 'line',
      data: {
        labels: fecha,
        datasets: [
          {
            label: this.ventasRegion[0].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "#4bc0c0",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#4bc0c0",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#4bc0c0",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasRegion[0].values,
            spanGaps: false,
          },
          {
            label: this.ventasRegion[1].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#f98f8f",
            borderColor: "#f53d3d",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#f53d3d",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#f98f8f",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasRegion[1].values,
            spanGaps: false,
          },
          {
            label: this.ventasRegion[2].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#23ffad",
            borderColor: "#1a9b61",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#1a9b61",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#23ffad",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasRegion[2].values,
            spanGaps: false,
          },
          {
            label: this.ventasRegion[3].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#ffbc00",
            borderColor: "#f09300",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#f09300",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#ffbc00",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasRegion[3].values,
            spanGaps: false,
          },
          {
            label: this.ventasRegion[4].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#d531e9",
            borderColor: "#7b1fa2",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#7b1fa2",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#d531e9",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasRegion[4].values,
            spanGaps: false,
          }
        ]
      }
    });

    this.lineChartSucursal = new Chart(this.lineCanvasSucursal.nativeElement, {
      type: 'line',
      data: {
        labels: fecha,
        datasets: [
          {
            label: this.ventasSucursales[0].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "#4bc0c0",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#4bc0c0",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#4bc0c0",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasSucursales[0].values,
            spanGaps: false,
          },
          {
            label: this.ventasSucursales[1].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#f98f8f",
            borderColor: "#f53d3d",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#f53d3d",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#f98f8f",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasSucursales[1].values,
            spanGaps: false,
          },
          {
            label: this.ventasSucursales[2].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#23ffad",
            borderColor: "#1a9b61",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#1a9b61",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#23ffad",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasSucursales[2].values,
            spanGaps: false,
          },
          {
            label: this.ventasSucursales[3].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#ffbc00",
            borderColor: "#f09300",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#f09300",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#ffbc00",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasSucursales[3].values,
            spanGaps: false,
          },
          {
            label: this.ventasSucursales[4].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#d531e9",
            borderColor: "#7b1fa2",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#7b1fa2",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#d531e9",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.ventasSucursales[4].values,
            spanGaps: false,
          }
        ]
      }
    });

    this.lineChartArticulo = new Chart(this.lineCanvasArticulo.nativeElement, {

      type: 'line',
      data: {
        labels: fecha,
        datasets: [
          {
            label: this.ventas[0].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "#4bc0c0",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#4bc0c0",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#4bc0c0",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: [334,382,852,154],
            spanGaps: false,
          },
          {
            label: this.ventas[2].articulo,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#f98f8f",
            borderColor: "#f53d3d",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#f53d3d",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#f98f8f",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: [634,921,102],
            spanGaps: false,
          }
        ]
      }

    });
    this.loadingProvider.loadingDismiss();
  }
  testing(){
    this.test = {
      label: this.ventas[2].articulo,
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#f98f8f",
      borderColor: "#f53d3d",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "#f53d3d",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#f98f8f",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 3,
      pointHitRadius: 10,
      data: [999,500,102],
      spanGaps: false,
    };
  }
}
