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

