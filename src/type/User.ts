export interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    joined: string;
    status: 'created' | 'verified'
}