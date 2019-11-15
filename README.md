## Functional programming - Weapon datavis

![alt text](https://github.com/TomasS666/functional-programming/blob/master/wiki/weaponized-world.png "Logo Title Text 1")

## Description

## Installation steps
You can clone this repository by using the command ``` git clone ``` in your CLI.
Or you can just push the green button right on the top of this page and download the repo as a zip file.

## Features
- Datavisualisation in d3
- Functional data fetch and transform pattern
- Cleaning pattern for language column student survey data

## Demo Datavis
[Find it here!](https://tomass666.github.io/functional-programming/)

## Data I'm fetching
```sql

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX gn: <http://www.geonames.org/ontology#>

# tel de materiaalsoorten bij wapens
SELECT ?title ?typeLabel ?long ?lat ?plaats (SAMPLE(?cho) as ?filtered)  (COUNT(?cho) AS ?choCount) WHERE {
  # selecteer soorten wapens
  <https://hdl.handle.net/20.500.11840/termmaster12445> skos:narrower ?type .
  ?type skos:prefLabel ?typeLabel .

  # geef objecten van een soort wapen
  ?cho dc:title ?title.
  ?cho edm:object ?type .
	
  
  ?plaats skos:exactMatch/wgs84:lat ?lat . #
  ?plaats skos:exactMatch/wgs84:long ?long .


}

LIMIT 10000`;
```

## Variabelen
Ik haal met de bovenstaande query objecten op met de volgende properties:

**title : is vanzelfsprekend de titel van het object**

**typeLabel: is de functie van het wapen, bijv. ceremonieel.**

**Lat en long: coördinaten (niet DMS format)**

**choCount : het aantal van het object (eigenlijk niet nodig)**

**plaats: deeplink naar plaats**

## Credits
Eyob voor alle tips rondom het chainen van mijn functies.
Laurens voor de voorbeelden, vooral de legend in d3 en de runquery die ik als basis heb gebruikt.
Ramon voor alle feedback op mijn wiki, het helpen met d3 en het deployen. 
Robert voor de mental support en de tips voor de cleanup pattern.
Voor het plotten van cirlces op de map: [link](http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6)

[Curran Kelleher](https://www.youtube.com/channel/UCSwd_9jyX4YtDYm9p9MxQqw) voor alle tutorials en een beter begrip van D3 door het wat luchtiger te maken.

## Fetch pattern
Fetch functions:

```javascript

async function getData(url, query){
    const newQuery = createQuery(url, query);
    const fetch = await fetchData(newQuery, 'json');
    const data = await dataResponse(fetch, toJSON);
    
    return data;
}

function createQuery( url, query ){
    return url+"?query="+ encodeURIComponent(query); 
}

/* 
    Format is json by default if the developer ommits the format argument
*/

function fetchData( query, format ){
    // Format is JSON by default unless otherwise stated
    return format ? fetch(`${ query }&format=${ format }`) : fetch(`${ query }`);
}

/*
    Data response - needs a fetch as argument and an 
*/

async function dataResponse( fetch, fn ){

    // Await the given fetch promise 
    let response = await fetch;
    let result = fn ? await fn(response) : response;
    
    // if callback function is given use it, call it, else just return the response
    return result;
}

// Data parsing / converting

async function toJSON( response ){
    let jsonData = await response;
    let res = await jsonData.json();

    return res;
}

/* 
    There is a reason I export all of my functions which is described in my wiki
*/

export { getData, createQuery, fetchData, dataResponse, toJSON }


```

## Cleanup pattern
Cleanup functions

```javascript

/*
    From a newline seperated column to an array
*/
function columnToArray (column) {
    return new Promise((resolve, reject) =>{
        if(column !== undefined){ 
            resolve(column.split(/\n/g));
        }else{
            reject( new Error("Given data is undefined") )
        }
    })
}

/*
    Filter out empty values    
*/

function filterEmptyValues(data){
    return new Promise((resolve, reject)=>{
        if(data !== undefined){       
            resolve(data.filter(item => item !== "" ))
        }else{
            reject(new Error('sorry mate'))
        }
    })
}

/*
    Returns an array split on a value given or comma by default
*/
function replaceAndSeperate(data, regexp, item, newValue = ','){
   
    return new Promise((resolve, reject) => {
        
        const test = data[33].trim();

        console.log(test.charAt(test.length -1))
        if(data !== undefined){
            resolve( data.map(entry => entry.trim().replace(regexp, newValue).split(newValue)) );
        }else{
            reject(new Error('Given value is undefined'))
        }
    })
    
}

function capatalize(arrays){
    return new Promise((resolve, reject)=>{
        if(arrays !== undefined){

            let newData = arrays.map((array) => {
                return array.map((item) => {
                    return item.replace(item.charAt(0), item.charAt(0).toUpperCase() ) 
                }) 
            })

            resolve(newData)
        }else{
            reject(new Error('Value is undefined, need an array'))
        }
    })
}

export {columnToArray, filterEmptyValues, replaceAndSeperate, capatalize}

``` 

