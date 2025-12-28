
export interface Item {
  id: string;
  reference: string;
  designation: string;
  unit: string | number;
  pu: number;
  quantityRecommended: number;
}

export interface SalesConditions {
  deliveryDelay: string;
  deliveryMode: string;
  paymentDelay: string;
  paymentMode: string;
}

export interface Offer {
  id: string;
  supplierName: string;
  supplierAddress: string;
  items: Item[];
  conditions: SalesConditions;
  isBestOffer: boolean;
}

export interface PurchaseOrderItem extends Item {
  quantity: number;
  total: number;
}

export interface PurchaseOrder {
  orderNumber: string;
  date: string;
  buyer: {
    name: string;
    address: string;
    tva: string;
    bce: string;
    iban: string;
  };
  supplier: {
    name: string;
    address: string;
  };
  items: PurchaseOrderItem[];
  conditions: SalesConditions;
  signature: string;
}

export enum ExerciseStep {
  INTRO = 'INTRO',
  COMPARISON = 'COMPARISON',
  ORDER_FORM = 'ORDER_FORM',
  REVIEW = 'REVIEW'
}
