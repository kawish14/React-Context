import React from 'react';
import {Row, Col, Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle} from 'reactstrap';

export const Loading = () => {
    return(
        <div style={styles.spinner}>
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading . . .</p>
        </div>
    );
};

const styles = {
    spinner:{
        position: 'absolute',
        height: 100,
        width: 100,
        top: '50%',
        left: '50%',
        marginLeft: -50,
        marginTop: -50,
        backgroundSize: '100%'
    }
}