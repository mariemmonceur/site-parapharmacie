import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private http: HttpClient) {}
  host: string = "http://localhost:3000";

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.host + '/products');
  }

  getSelectedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.host + '/products?selected=true');
  }

  getAvailableProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.host + '/products?available=true');
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.host + '/products?name_like=' + keyword);
  }

  select(product: Product): Observable<Product> {
    product.selected = !product.selected;
    return this.http.put<Product>(this.host + '/products/' + product.id, product);
  }

  deleteProduct(product: Product): Observable<void> {
    return this.http.delete<void>(this.host + '/products/' + product.id);
  }

  save(product: Product): Observable<Product> {
    return this.http.post<Product>(this.host + '/products', product);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(this.host + '/products/' + id);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.host}/products/${id}`, product);
  }
  
  updateProductQuantity(id: number, quantity: number): Observable<Product> {
    // Récupérer le produit existant
    return this.getProduct(id).pipe(
      switchMap((product) => {
        // Mettre à jour la quantité
        product.quantity = (product.quantity || 0) - quantity;
  
        // Si la quantité devient inférieure ou égale à 0, supprimer le produit
        if (product.quantity <= 0) {
          return this.deleteProduct(product).pipe(map(() => product));
        } else {
          // Sinon, mettre à jour le produit avec la nouvelle quantité
          return this.updateProduct(product.id, product);
        }
      })
    );
  }
  
  getCategories(): Observable<string[]> {
    return this.getAllProducts().pipe(
      map((products) => {
        if (!products || products.length === 0) {
          console.warn('No products found');
          return [];
        }
        return [...new Set(products.map((product) => product.category || 'Unknown'))];
      }),
      catchError((err) => {
        console.error('Error fetching categories:', err);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  
  
  
}
