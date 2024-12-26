import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/product.model';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './addtocart.component.html',
  styleUrls: ['./addtocart.component.css']
})
export class AddToCartComponent implements OnInit {
  cartItems: Product[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * (item.selectedQuantity || 1), 0);
  }

  confirmPurchase(): void {
    const confirmPurchase = confirm('veux tu confirmer lachat ');
  
    if (confirmPurchase) {
      this.cartItems.forEach((cartProduct) => {
        const selectedQuantity = cartProduct.selectedQuantity ?? 1; // Si `selectedQuantity` est `undefined`, on utilise 1 par défaut.
  
        if (selectedQuantity > 0) {
          // Appeler la méthode de service pour mettre à jour la quantité du produit
          this.productsService.updateProductQuantity(cartProduct.id, selectedQuantity).subscribe({
            next: () => {
              console.log(`Produit ${cartProduct.id} mise a jour `);
              // Réduire la quantité dans le panier
              cartProduct.selectedQuantity = 0; // Vous pouvez aussi la réduire par le montant acheté
            },
            error: (err) => {
              console.error(`erreur lors de mise a jour ${cartProduct.id}:`, err);
            }
          });
        }
      });
  
      // Vider le panier après la confirmation de l'achat
      this.cartService.clearCart();
      this.cartItems = [];
      this.calculateTotalPrice();
  
      alert('achat confirmé!');
    }
  }
  

  updateQuantity(product: Product, change: number): void {
    const index = this.cartItems.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.cartItems[index].selectedQuantity = Math.max(
        1,
        (this.cartItems[index].selectedQuantity || 1) + change
      );
      this.calculateTotalPrice();
    }
  }

  clearCart(): void {
    const confirmClear = confirm('est tu sure de supprimer ');
    if (confirmClear) {
      this.cartItems = [];
      this.cartService.clearCart();
      this.calculateTotalPrice();
    }
  }
}
