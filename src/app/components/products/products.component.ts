import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../model/product.model';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppDataState, DataStateEnum } from '../../state/product.state';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable<AppDataState<Product[]>> | null = null;
  filteredProducts$: Observable<AppDataState<Product[]>> | null = null;
  readonly DataStateEnum = DataStateEnum;
  cartCount: number = 0;
  categories: string[] = [];
  searchTerm: string = ''; // Variable pour stocker la recherche


  constructor(
    private productsService: ProductsService,
    private router: Router,
    private cartService: CartService,

  ) {}

  ngOnInit(): void {
    this.onGetAllProducts();
    this.cartService.cartCount$.subscribe((count) => (this.cartCount = count));

  }

  onGetAllProducts() {
    this.products$ = this.productsService.getAllProducts().pipe(
      map((data) => {
        this.categories = [...new Set(data.map((product) => product.category).filter((category): category is string => !!category))];
        return { dataState: DataStateEnum.LOADED, data };
      }),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError((err) =>
        of({ dataState: DataStateEnum.ERROR, errorMessage: err.message })
      )
    );
    this.filteredProducts$ = this.products$; // Initialize filteredProducts$ with all products
  }
  
  onSelectCategory(category: string): void {
    if (category === 'all') {
      // Show all products
      this.filteredProducts$ = this.products$ || of({ dataState: DataStateEnum.LOADED, data: [] });
    } else {
      // Filter products by category
      this.filteredProducts$ = this.products$!.pipe(
        map((result) => ({
          ...result,
          data: (result.data ?? []).filter((p: Product) => p.category === category),
        })),
        startWith({ dataState: DataStateEnum.LOADING }),
        catchError((err) =>
          of({ dataState: DataStateEnum.ERROR, errorMessage: err.message })
        )
      );
      
    }
  }
  
  
  

  // Fetch selected products
  onGetSelectedProducts() {
    this.filteredProducts$ = this.productsService.getSelectedProducts().pipe(
      map((data) => ({ dataState: DataStateEnum.LOADED, data })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError((err) =>
        of({ dataState: DataStateEnum.ERROR, errorMessage: err.message })
      )
    );
  }

  // Fetch available products
  onGetAvailableProducts() {
    this.filteredProducts$ = this.productsService.getAvailableProducts().pipe(
      map((data) => ({ dataState: DataStateEnum.LOADED, data })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError((err) =>
        of({ dataState: DataStateEnum.ERROR, errorMessage: err.message })
      )
    );
  }


  

  // Delete a product
  onDelete(product: Product) {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce produit ?');
    if (confirmDelete) {
      this.productsService.deleteProduct(product).subscribe(() => this.onGetAllProducts());
    }
  }

  // Navigate to new product creation page
  onNewProduct() {
    this.router.navigateByUrl('/newProduct');
  }

  // Navigate to edit product page
  onEdit(product: Product) {
    this.router.navigateByUrl('/editProduct/' + product.id);
  }

  // Add product to cart
  onAddToCart(product: Product): void {
    if (product.available && product.selectedQuantity && product.selectedQuantity <= product.quantity) {
      // Ajoute le produit au panier avec la quantité sélectionnée
      this.cartService.addToCart(product);
  
  
      // Affiche un message de confirmation
      alert(`${product.name} est ajouté au panier avec une quantité  ${product.selectedQuantity}!`);
    } else {
      // Si le produit n'est pas disponible ou la quantité sélectionnée dépasse le stock
      alert('Le produit n\'est pas disponible ou la quantité sélectionnée est trop élevée!');
    }
  }
  
  

  SearchProduct(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      // Si la recherche est vide, afficher tous les produits
      this.filteredProducts$ = this.products$ || of({ dataState: DataStateEnum.LOADED, data: [] });
    } else {
      // Vérifiez que products$ est défini avant de continuer
      if (this.products$) {
        this.filteredProducts$ = this.products$.pipe(
          map((result: AppDataState<Product[]>) => {
            // Assurez-vous que result.data est défini avant de filtrer
            return {
              ...result,
              data: (result.data ?? []).filter((p: Product) =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase())
              ),
            };
          }),
          startWith({ dataState: DataStateEnum.LOADING }), // Facultatif : afficher un état de chargement
          catchError((err) => {
            console.error(err);
            return of({ dataState: DataStateEnum.ERROR, errorMessage: err.message });
          })
        );
      } else {
        // Gérez le cas où products$ est null
        this.filteredProducts$ = of({ dataState: DataStateEnum.LOADED, data: [] });
      }
    }
  }
  
  
  

 
  
 
  
  onToggleSelected(product: Product): void {
    this.productsService.select(product).subscribe({
      next: (updatedProduct) => {
        product.selected = updatedProduct.selected;
        alert(`Product ${updatedProduct.name} is now ${updatedProduct.selected ? 'selected' : 'unselected'}.`);
      },
      error: (err) => {
        console.error('erreur:', err);
        alert('erreur lors de selection.');
      },
    });
  }
}
