import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Product[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);

  // Observable pour écouter les changements du compteur du panier
  cartCount$ = this.cartCountSubject.asObservable();

  addToCart(product: Product): void {
    const existingProduct = this.cart.find((p) => p.id === product.id);
    
    if (!existingProduct) {
      // Si le produit n'existe pas dans le panier, ajoutez-le
      this.cart.push({ ...product, selectedQuantity: product.selectedQuantity ?? 1 }); // Valeur par défaut de 1
    } else {
      // Si le produit existe déjà, mettez à jour la quantité sélectionnée
      existingProduct.selectedQuantity = (existingProduct.selectedQuantity ?? 0) + (product.selectedQuantity ?? 1);
    }
  
    this.cartCountSubject.next(this.cart.length); // Mise à jour du compteur
  }
  


  // Récupérer les produits du panier
  getCartItems(): Product[] {
    return this.cart;
  }

  // Récupérer le nombre d'articles dans le panier
  getCartCount(): number {
    return this.cart.length;
  }

  // Supprimer un produit du panier
  removeFromCart(product: Product): void {
    const index = this.cart.indexOf(product);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.cartCountSubject.next(this.cart.length); // Mise à jour du compteur
  }

  // Vider tout le panier
  clearCart(): void {
    this.cart = []; // Réinitialiser le panier
    this.cartCountSubject.next(0); // Mettre à jour le compteur à 0
  }
  updateProductQuantity(product: Product, quantityToReduce: number): void {
    const existingProduct = this.cart.find((p) => p.id === product.id);
  
    if (existingProduct) {
      // Assurez-vous que selectedQuantity est défini avant d'effectuer les opérations
      if (existingProduct.selectedQuantity && existingProduct.selectedQuantity > 0) {
        // Réduire la quantité dans le panier sans supprimer tout le produit
        existingProduct.selectedQuantity -= quantityToReduce;
  
        // Si la quantité devient zéro ou moins, vous pouvez choisir de le supprimer
        if (existingProduct.selectedQuantity <= 0) {
          this.removeFromCart(existingProduct); // Optionnel : si vous voulez supprimer le produit du panier
        }
      } else {
        // Si selectedQuantity est undefined ou 0, vous pouvez soit la définir à 0, soit effectuer une autre action
        existingProduct.selectedQuantity = 0; // ou une autre logique selon le cas
      }
    }
  }
  
  

}
