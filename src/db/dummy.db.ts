import User  from "../type/User.ts"

const users: User[] = []


export function AddUser(user: User) {
    users.push(user)
}