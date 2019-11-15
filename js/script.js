import { getData } from './libs/fetchData.js';
import { columnToArray, filterEmptyValues, replaceAndSeperate, capatalize } from './libs/cleanData.js';



// getData(url, query).then(data =>{
//     // const regexp = new RegExp('°', 'g')
//     // console.log(data.results.bindings.filter(entry => !entry.long.value.match(regexp)) )
//     // return replaceAndSeperate( data, /[]+/g, data.typeLabel.value, 'hoi')
// }) 


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

    const talenData = async (data) => {
        let colums = await columnToArray(data)
        let noEmptyValues = await filterEmptyValues(colums)
        let cleanedData = await replaceAndSeperate(noEmptyValues, /[,;]+/g, ',')
        let capatalized = await capatalize(cleanedData)
        let newData = await capatalized

        console.log(newData)
        return newData;
    }

talenData(testData).then(data => {
    console.log(data)
}).catch(err => console.log(err));

