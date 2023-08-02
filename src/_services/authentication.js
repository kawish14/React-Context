import { BehaviorSubject } from 'rxjs';

import { handleResponse } from '../_hepler/handle-response';
import {authenticate} from '../url'

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

 const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};


function login(username, password, token) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, token })
    };

    // http://45.249.11.5:28200/users/authenticate
    //http://172.29.100.28:2000/users/authenticate
    // http://gis.tes.com.pk:28200/users/authenticate
    return fetch(authenticate, requestOptions)
        .then(handleResponse)
        .then(user => {
         
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });

}

function logout() {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
export  {authenticationService}
