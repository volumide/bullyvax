import jwt_decode from 'jwt-decode'; 

export default class Utils {
    static decodeJWT(token: any) {
        return jwt_decode(token);
    }
}