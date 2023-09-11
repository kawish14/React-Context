let version = '4.26'
/* Public IP and Port */
/* let api = "http://gis.tes.com.pk:28881" // API URL
let authenticate =  `http://gis.tes.com.pk:28200/users/authenticate` // Login URL
const ENDPOINT = "http://gis.tes.com.pk:5001" // Real-Time URL
const NCE = `http://gponassistant.tes.com.pk:8000/ontrx` // NCE URL 
let outage =  `http://gis.tes.com.pk:28200/outage`
let olt = 'http://gis.tes.com.pk:28200/fsp'
let cpeCount = 'http://gis.tes.com.pk:28200/countCPE'  */


/* Private IP and Port */
 let api = "http://172.29.100.28:8081" //API URL 
let authenticate = `http://172.29.100.28:2000/users/authenticate` // Login URL
const ENDPOINT = "http://172.29.100.28:5000"; // Real-Time URL 
const NCE = `http://gponassistant.tes.com.pk:8000/ontrx` // NCE URL 
let outage =  `http://172.29.100.28:2000/outage`
let olt = 'http://172.29.100.28:2000/fsp'
let cpeCount = 'http://172.29.100.28:2000/countCPE'

/*  let outage =  `http://localhost:2000/outage`
 let olt = 'http://localhost:2000/fsp'
 let cpeCount = 'http://localhost:2000/countCPE' */
export {api,authenticate,ENDPOINT,NCE,version, outage,olt,cpeCount}