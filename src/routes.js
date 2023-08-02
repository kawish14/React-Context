import React from 'react'
import Role from './role';
import  Maps  from './components/map/Map';
import LoginPage from './LoginPage/LoginPage'

let routes = [

    {
        component: LoginPage,
        path: "/",
        exact: true,
        //head: () => <div className="page-breadcrumb" style={styles.crumb}>Dashboard</div>

    },
     {
        component: Maps,
        path: "/gis-portal",
        exact: false,
       // roles: [Role.SouthDEVuser],
        /*  head: () => <div className="page-breadcrumb" style={styles.crumb}>South Region</div> */
    }


]

let rgb = [110, 110, 110]

let styles = {
    crumb: {
        /* color: `rgb(${rgb})`, */
        fontSize: '14px'
    }
}

export default routes