import { User } from '../models/generalModels';


export class RoleValidator {

    isUser(user: User){
        return user.rol === 'user';
    }

    isAdmin(user: User): boolean{
        return user.rol === 'admin';
    }

    isSeller(user: User): boolean{
        return user.rol === 'vendedor';
    }


}
