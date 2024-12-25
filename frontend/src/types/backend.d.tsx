
export interface IProduct {
    id: number;
    name: string;
    category_id: number
    price: number;
    image: string;
    description: string;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER'
}

export interface IUser {
    id: number;
    name: string;
    role: UserRole;
    phone: string;
}

export enum BillStatus {
    PENDING = 'PENDING',
    SETTLED = 'SETTLED',
    REFUNDED = 'REFUNDED'
}

export interface IBill {
    id: number,
    admin_id: number,
    customer_id: number,
    date: "2024-12 - 24T15: 49:00.000Z",
    notes: string,
    status: BillStatus,
}

export interface IBillProduct {
    id: number;
    bill_id: number;
    product_id: number;
    quantity: number;
}