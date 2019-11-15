function columnToArray (column) {
    return new Promise((resolve, reject) =>{
        if(column !== undefined){ 
            resolve(column.split(/\n/g));
        }else{
            reject( new Error("Given data is undefined") )
        }
    })
}

function filterEmptyValues(data){
    return new Promise((resolve, reject)=>{
        if(data !== undefined){       
            resolve(data.filter(item => item !== "" ))
        }else{
            reject(new Error('sorry mate'))
        }
    })
}

// function removeLastChar(array, replacement){
//     return new Promise((resolve, reject) => {

//         if(array !== undefined || replacement !== undefined ){
//             array.map(item => item.charAt(array.length - 1))
//         }else{
            
//         }
//     })
// }

// returns an array split on a value given or comma by default
function replaceAndSeperate(data, regexp, item, newValue = ','){
   
    return new Promise((resolve, reject) => {

        if(data !== undefined){
            
            let noSpace = data.map(entry => entry.replace(/\s/g, ""))

            let transformedData = noSpace.map(entry => {
                return entry.replace(regexp, newValue).split(newValue)
            });

            console.log(noSpace)

            resolve( transformedData );
        }else{
            reject(new Error('Given value is undefined'))
        }
    })
    
}

function capatalize(arrays){
    return new Promise((resolve, reject)=>{
        if(arrays !== undefined){

            let dataToLowerCase = arrays.map((array) => {
                return array.map((item) => {
                    return item.toLowerCase();
                }) 
            })

            let newData = dataToLowerCase.map((array) => {
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