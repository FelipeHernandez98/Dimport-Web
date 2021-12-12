import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast : any;
declare var Cleave : any;
declare var StickySidebar : any; 
declare var paypal : any;

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
} 

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @ViewChild('paypalButton',{static:true}) paypalElement : ElementRef | any;

   public idcliente : any;
   public token : any;

    public carrito_arr : Array<any> =[];
    public url : any;
    public subtotal =0;
    public total_pagar =0;
    public socket = io('http://localhost:4201');
    public direccion : any;
    public venta : any = {};
    public dventa : Array<any> = [];

  constructor(private _clienteService : ClienteService, private _guestService : GuestService) { 
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this.idcliente = localStorage.getItem('_id');
    this.venta.cliente = this.idcliente;
    
  }

  ngOnInit(): void {

    this.init_Data();

    setTimeout(()=>{
      new Cleave('#cc-number', {
        creditCard: true,
      });

      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
      });

      var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });

    this.obtener_direccion();

    paypal.Buttons({
        style: {
            layout: 'horizontal'
        },
        createOrder: (data:any,actions:any)=>{

            return actions.order.create({
              purchase_units : [{
                description : 'Pago tienda',
                amount : {
                  currency_code : 'USD',
                  value: 99
                },
              }]
            });
          
        },
        onApprove : async (data:any, actions:any)=>{
          const order = await actions.order.capture();
          console.log(order);

          this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
          this.venta.detalles = this.dventa;
          this.venta.direccion = this.direccion._id;

          console.log(this.venta);

          this._clienteService.registro_compra_cliente(this.venta,this.token).subscribe(
            response =>{
              console.log(response);
            }

          );

          
        },
        onError : (err : any)=>{
          console.log("Error Paypal *****");
        },
        onCancel: function (data:any, actions:any) {
          console.log("error paypal");
        }
      }).render(this.paypalElement.nativeElement);
  }

  init_Data(): void{
    this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;

        this.carrito_arr.forEach((element : any) =>{
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto.precio * element.cantidad,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente:localStorage.getItem('_id')
          });
        });
        this.calcular_carrito();

      },error =>{
        iziToast.show({
          backgroundColor: '#dc3424',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ocurrio un error en el servidor',
          messageColor: '#FFFFFF',
          progressBarColor: '#FFFFFF'
        });
      }
    );
  }

  obtener_direccion(){
    this._clienteService.obtener_direccion_principal(this.idcliente, this.token).subscribe(
      response=>{
        console.log("Direccion " + response.data);
        if(response.data == undefined){
          this.direccion = undefined;
        }else{
          this.direccion = response.data;
        }
      },error=>{
        iziToast.show({
          backgroundColor: '#dc3424',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ocurrio un problema con el servidor',
          messageColor: '#FFFFFF',
          progressBarColor: '#FFFFFF'
        });
      }
    );
  }

  calcular_carrito(){
    this.subtotal = 0;
    this.carrito_arr.forEach(element =>
      {
        this.subtotal = this.subtotal + parseInt(element.producto.precio);
      });

    this.total_pagar = this.subtotal;
    this.venta.subtotal = this.total_pagar;
    
  }

  eliminar_item(id: any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        iziToast.show({
              backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se elimino el producto correctamente',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
            });
        this.socket.emit('delete-carrito',{data:response.data});
        this.init_Data();
      }
    );
  }
}
