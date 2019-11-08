function columnToArray (column) {
    return new Promise((resolve, reject) =>{
        if(column !== undefined){
            let splittedData = column.split(/\n/g);
            resolve(splittedData);
        }else{
            reject( new Error("Given data is undefined") )
        }
    })
}

function filterEmptyValues(data){
    return new Promise((resolve, reject)=>{
        if(data){
            let newData = data.filter(item =>{
                return item !== "";
            })
            resolve(newData)
        }else{
            reject(new Error('sorry mate'))
        }
    })
}

// returns an array split on a value given or comma by default
function replaceAndSeperate(data, regexp, newValue = ','){
   
    return new Promise((resolve, reject)=>{
        if(data !== undefined){
            let newData = data.map(item => {
                return item.replace(regexp, newValue).split(newValue)
            })
            resolve(newData);
        }else{
            reject(new Error('Given value is undefined'))
        }
    })
    
}

function capatalize(arrays){
    return new Promise((resolve, reject)=>{
        if(arrays !== undefined){
            let capatalized = arrays.map(array => array.map(item => item.replace(item.charAt(0), item.charAt(0).toUpperCase() ) ) )
            resolve(capatalized)
        }else{
            reject(new Error('Value is undefined, need an array'))
        }
    })
}

export {columnToArray, filterEmptyValues, replaceAndSeperate, capatalize}