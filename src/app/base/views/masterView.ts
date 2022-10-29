import { AlertController } from '@ionic/angular';
import { messageType } from '../models/generalModels';

export class MasterView {
    constructor(
        private alerts: AlertController
    ) {}

    addExam(data: any){

        const dataCart = localStorage.getItem('cart');

        const item = {
          item: data,
          quantity: 1
        };
        this.alert('Examen añadido con exito', messageType.success);

        if(dataCart !== null){

          const cart = JSON.parse(dataCart);
          cart.push(item);
          localStorage.setItem('cart',JSON.stringify(cart));

          this.alert('Examen añadido con exito', messageType.success);

        }else{
          const cart = [];
          cart.push(item);
          localStorage.setItem('cart', JSON.stringify(cart));
          this.alert('Examen añadido con exito', messageType.success);

        }
    }

    async alert(message: string, type: messageType ) {
        const alert = await this.alerts.create({
            message,
            buttons: [
              {
                text: 'Cerrar',
                cssClass: messageType.danger
              }
            ]
        });

        await alert.present();
    }

    formatPrice(data: number){
      const price = new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0
      });

      return price.format(data);
  }
}
