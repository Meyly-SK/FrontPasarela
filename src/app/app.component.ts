import { Component, OnInit } from '@angular/core';
import { PaymentService, PaymentRequest, TokenResponse, PaymentResponse, ErrorResponse } from './services/payment.service'; 
import dropin from 'braintree-web-drop-in';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ProyectoBrainTree';
  amount: number = 0; 
  private dropinInstance: any;
  errorMessage: string | null = null;  
  successMessage: string | null = null; 

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.getBraintreeToken();
  }

  getBraintreeToken() {
    this.paymentService.getToken().subscribe((response: TokenResponse) => {
      const token = response.token; 
      this.initializeBraintree(token);
    }, (error) => {
      console.error('Error fetching token:', error);
      this.errorMessage = 'Error al obtener el token. Intenta nuevamente.'; 
    });
  }

  initializeBraintree(token: string) {
    dropin.create({
      authorization: token,
      container: '#dropin-container'
    }, (error, instance) => {
      if (error) {
        console.error('Error al inicializar Braintree:', error);
        this.errorMessage = 'Error al inicializar el formulario de pago. Intenta nuevamente.'; 
        return;
      }

      this.dropinInstance = instance;
      console.log('Braintree Drop-in inicializado correctamente');
    });
  }

  submitPayment() {
    if (!this.dropinInstance) {
      console.error('Braintree Drop-in no se ha inicializado correctamente');
      this.errorMessage = 'El formulario de pago no está listo. Intenta nuevamente en unos momentos.'; 
      return;
    }

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Por favor, ingresa una cantidad válida'; 
      return;
    }

    this.dropinInstance.requestPaymentMethod((error, payload) => {
      if (error) {
        console.error('Error al solicitar el método de pago:', error);
        this.errorMessage = 'Error al solicitar el método de pago. Intenta nuevamente.'; 
        return;
      }

      this.processPayment(payload.nonce);
    });
  }

  processPayment(nonce: string) {
    const paymentData: PaymentRequest = {
      amount: this.amount.toString(),
      paymentMethodNonce: nonce
    };

    this.paymentService.processPayment(paymentData).subscribe((response: PaymentResponse) => {
      console.log('Pago procesado exitosamente:', response);
      alert('Pago procesado exitosamente. ' + response.message); 
      this.successMessage = response.message; 
      this.errorMessage = null; 
    }, (error: ErrorResponse) => {
      console.error('Error procesando el pago:', error);
      this.errorMessage = 'Error procesando el pago: ' + (error.error || 'Intenta nuevamente.'); 
      alert(this.errorMessage); 
      this.successMessage = null; 
    });
  }
}