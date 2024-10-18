import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8080/api';
  constructor(private http : HttpClient) { }

  //metodo para obtener el token
  getToken():Observable<string>{
    return this.http.get(`${this.apiUrl}/token`,{responseType : 'text'});
  };
}
