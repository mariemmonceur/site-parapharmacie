export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
  available: boolean;
  selectedQuantity?:number;
  imageUrl: string; // Nouvelle propriété pour l'image
  category?: string; // Ajout de la catégorie
  discount?: boolean; // Indique si un produit a une réduction
  discountPrice?: number; 
}
