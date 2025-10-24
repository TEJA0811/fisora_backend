export interface User {
    id: string;
    name: string;
    phone: string;
    password: string;
    joined: Date;
    status: 'created' | 'verified'
}