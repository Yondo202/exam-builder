
import Cookies from 'js-cookie';

export const SignOut = () =>{
    Cookies.remove('access_token');
    window.location.reload();
}