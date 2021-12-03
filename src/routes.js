import React from 'react';
import Admin from './components/admin/AdminComponent'
import South from './components/south/SouthComponent'

export default [
/*     {
        component: MainDash,
        path: "/",
        exact: true,
        head: () => <div className="page-breadcrumb" style={styles.crumb}>Dashboard</div>
        
    }, */
 
    {
        component: Admin,
        path:"/",
        exact: true,
        //head: () =>  <div className="page-breadcrumb" style={styles.crumb} > Map </div>
    },
    {
        component: South,
        path:"/south",
        exact: true,
        //head: () =>  <div className="page-breadcrumb" style={styles.crumb} > New Entry </div>
    }

]