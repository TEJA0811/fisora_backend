export interface Order {
    id: string;
    userId: string; // userId
    itemId: string; //
    quantity: number;
    price: string;
    orderAt: string;
    status: 'pending' | 'accepted' | 'declined' | 'onaway' | 'delivered'
    deliverdAt?: string
}