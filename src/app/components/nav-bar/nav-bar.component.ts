import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  cartCount: number = 0; // Initialiser le compteur du panier

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // S'abonner à l'observable pour écouter les changements du compteur
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }
}
