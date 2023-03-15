import React from 'react'
import Role from './role';
import  SouthMap  from './components/south/SouthMap';
import  NorthMap  from './components/north/NorthMap';
import  CentralMap  from './components/central/CentralMap';
import  Admin  from './components/admin/Admin';
import CSD from './components/csd/CSDComponent';
import TWA from './components/twa/TWA'
import LoginPage from './LoginPage/LoginPage'

let routes = [

    {
        component: LoginPage,
        path: "/",
        exact: true,
        //head: () => <div className="page-breadcrumb" style={styles.crumb}>Dashboard</div>

    },
     {
        component: SouthMap,
        path: "/south",
        exact: false,
        roles: [Role.SouthDEVuser],
        /*  head: () => <div className="page-breadcrumb" style={styles.crumb}>South Region</div> */
    },
    {
        component: NorthMap,
        path: "/north",
        exact: false,
         roles: [Role.NorthDEVuser],
        /*  head: () => <div className="page-breadcrumb" style={styles.crumb}>South Region</div> */
    },
    {
        component: CentralMap,
        path: "/central",
        exact: false,
         roles: [Role.CentralDEVuser],
        /*  head: () => <div className="page-breadcrumb" style={styles.crumb}>South Region</div> */
    },
    {
        component: Admin,
        path: "/management",
        exact: false,
         roles: [Role.Admin],
        /*  head: () => <div className="page-breadcrumb" style={styles.crumb}>South Region</div> */
    },
     {
        component: CSD,
        path: "/commercial",
        exact: false,
         roles: [Role.CSD],
  
    },
    {
        component: TWA,
        path: "/twa",
        exact: false,
         roles: [Role.TWA],
  
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