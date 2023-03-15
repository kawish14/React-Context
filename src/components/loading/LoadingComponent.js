import React from 'react';
import {WaveLoading} from 'react-loadingg'
import './loading.css'

export const Loading = () => {
    return(
        <div style={styles.spinner}>
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading . . .</p>
        </div>
    );
};

export const WaveLoadings = () => <WaveLoading style={styles.waveBar}/>

export const customLoader = () =>{

    let elem = document.getElementById('pHolder');
    let percent = 0

    setInterval(() =>{
        if (percent == 100){
            clearInterval()
        }
        else{
            percent += 1
            elem.innerHTML = percent + "%"
        }
    },40)

    return (
        <div className='main'>
            <p id="pHolder">0%</p>
            <div className='half'></div>
            <div className='full'></div>

        </div>
    )
}
const styles = {
    spinner:{
      /*   position: 'absolute',
        height: 100,
        width: 100,
        top: '50%',
        left: '50%',
        marginLeft: -50,
        marginTop: -50,
        backgroundSize: '100%' */
    }
}