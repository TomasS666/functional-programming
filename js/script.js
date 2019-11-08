import { createQuery, fetchData, dataResponse, toJSON } from './libs/fetchData.js';
import { columnToArray, filterEmptyValues, replaceAndSeperate, capatalize } from './libs/cleanData.js';

const testData = `Welke talen spreek je? (Meerdere talen scheiden door puntkommaâ€™s)
Nederlands, Engels, Frans
Engels
Cantonees; Engels; Nederlands
Engels; Nederlands
Nederlands; Engels
nederlands;engels;duits
Engels; Nederlands; Duits
Engels, Nederlands, Duits, Spaans
Nederlands; Engels

Nederlands, engels
Spaans; Duits; Nederlands; Engels
Duits; Engels; Nederlands
Nederlands; Engels; Duits
Nederlands; Engels; Spaans
Nederlands, Engels, Duits
Nederlands, Engels
Nederlands;Engels;Frans;Duits
Engels; nederlands;

Nederlands, Fries en Engels
Nederlands; Engels
nederlands ; engels
Engels
Nederlands, Duits, Frans, Engels
Nederlands; Engels
Engels
Nederlands; Engels
Nederlands;Engels
Nederlands; Engels
Nederlands;Engels;Frans
Engels, Nederlands
Nederlands;Engels
Nederlands; Engels; Duits; Spaans; Frans
Surinaams, Nederlands, Engels,
Nederlands; Engels; Frans; 
Nederlands; Engels
Nederlands
nederlands;engels
Nederlands; engels
Spaans, Engels, NEderlands
Engels, Nederlands, Frans
Nederlands; Engels; Frans
engels, nederlands, tagalog
Nederlands;Engels
Nederlands; Engels
Nederlands; engels
Nederlands; Engels; Frans;
Nederlands; Engels
Nederlands; Engels
Ghanees, Nederlands, Engels
Nederlands;Engels;Duits;Frans;Spaans;Japans
Nederlands; Engels; Duits
Nederlands, Engels
Engels, Duits en Nederlands
Nederlands;Engels
Engels; Nederlands
Nederlands; Engels
Nederlands; Engels
Engels
Engels
Engels
Nederlands; Vietnamees; Engels
Nederlands, Engels
Engels; Duits; Nederlands
Nederlands;Engels
Nederlands;Engels;Kroatisch;Duits
Nederlands, Engels
Nederlands; Engels
Nederlands, Duits, Engels
Arabisch; engels; Nederlands
Nederlands ; Engels
Nederlands;Engels
Engels, Nederlands, Duits
4 talen, Zeg het liever niet.
Nederlands; Frans; Engels; Duits; Indonesisch; Javaans; JavaScript
NL;Engels
Nederlands;Engels
Armeens; Nederlands; Engels
Nederlands; Engels; Frans
Nederlands, Duits, Engels
Nederlands, Engels, Spaans`;







const talenData = columnToArray(testData)
.then(data => filterEmptyValues(data) )
.then(data => replaceAndSeperate(data, /[, ;]+/g, ',') )
.then(data => capatalize(data))
.then((data) => data.map(item => {
    return { 
        talen: item 
    }
}))
.then(data => console.log(data))
.catch(err => console.log(err))

console.log(talenData)


// const url ="https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-38/sparql";
// const url = "https://gist.githubusercontent.com/TomasS666/568935a5ebd9474bc1324d9a57866783/raw/7b405950f40f7eb876172f69b366ceff153e5012/testdata.csv"
// var query = `
// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
// PREFIX dc: <http://purl.org/dc/elements/1.1/>
// PREFIX dct: <http://purl.org/dc/terms/>
// PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
// PREFIX edm: <http://www.europeana.eu/schemas/edm/>
// PREFIX foaf: <http://xmlns.com/foaf/0.1/>

// # tel de materiaalsoorten bij wapens
// SELECT ?title ?type ?typeLabel (COUNT(?cho) AS ?choCount) WHERE {
//   # selecteer soorten wapens
//   <https://hdl.handle.net/20.500.11840/termmaster12445> skos:narrower* ?type .
//   ?type skos:prefLabel ?typeLabel .

//   # geef objecten van een soort wapen
//   ?cho edm:object ?type .

//   # geef het materiaal 
//   ?cho dct:medium ?material .
//   ?cho dc:title ?title.
  
//   # geef het label van het materiaal
//   ?material skos:prefLabel ?materialLabel .
// }
// ORDER BY DESC(?choCount)
// LIMIT 200
// `;


// createQuery(url, query).then(data =>{
//     document.querySelector('body').append('<pre'+data+'</pre>')
// })

// async function fetchAndconvert(url, query){
//     let result = await dataResponse( 
//         fetchData( createQuery(url, query), 'json' ), toJSON
//     );
//     return result;
// }

// async function fetchUrl(url){
//     let res = await dataResponse( fetchData(url))

//     return res; 

// }

// fetchUrl(url).then(result => console.log(result))


// fetchAndconvert(url, query).then(result => {
// console.log(result)
//     document.querySelector('#root').textContent = JSON.stringify(result.results.bindings)

// }) 

// console.log(testData.split(/\n/g))


/* 
    Cleaning takes seperated data by newlines, 
    a regular expression and a new value is optional but a comma by default
*/
// const cleaning = (data, regexp, newValue = ',') =>{
//    return data
//     .split(/\n/g)
//     .filter(item =>{
//         return item !== "";
//     })
//     .map(item => {
//         return {
//             talen : item.replace(regexp, newValue).split(newValue).map(item => item.replace(item.charAt(0), item.charAt(0).toUpperCase()))
//         }
//     })
// }



// const talenData = cleaning(testData, /[, ;]+/g, ',');

// const transformLandCodes = (array) =>{
//     return array.filter(item => item.charAt(1) === item.charAt(1).toUpperCase())
// }

// console.log(talenData)


//    console.log( 

//         testData.split(/\n/g)
//         .filter(item => {
//             return item !== "";
//         })
//         .map( item =>{  
//             return { talen: item }
//         })
        
        

//     )
// }

// cleaning()

