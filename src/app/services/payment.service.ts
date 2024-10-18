import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  amount: string;
  paymentMethodNonce: string;
}

export interface TokenResponse {
  token: string;
}

export interface PaymentResponse {
  message: string; 
  transactionId?: string; 
}

export interface ErrorResponse {
  error: string; 
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Método para obtener el token
  getToken(): Observable<TokenResponse> { 
    return this.http.get<TokenResponse>(`${this.apiUrl}/token`);
  }

  // Método para procesar el pago
  processPayment(paymentData: PaymentRequest): Observable<PaymentResponse | ErrorResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<PaymentResponse | ErrorResponse>(`${this.apiUrl}/procesar-pago`, paymentData, { headers });
  }
}