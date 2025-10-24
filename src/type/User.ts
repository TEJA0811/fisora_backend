interface User {
    id: string;
    name: string;
    phone: string;
    password: string;
    joined: string;
    status: 'created' | 'verified'
}

export default User