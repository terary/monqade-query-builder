"use strict";

// const MonqadeBuilder = require("../lib/MonqadeBuilder");
// const userMonqade = MonqadeBuilder.getMonqadeFromFileName(fileName,mongoose);
// console.log('userMonqade.searchablePathsWithTypesObject()',userMonqade.searchablePathsWithTypesObject());
const fieldsWithTypes=  { orgID: 'String',
companyName: 'String',
city: 'String',
state: 'String',
idxBucket: 'Number',
someDate: 'Date',
memberSinceDate: 'Date',
isActive: 'Boolean' };

const LAMBDAS = require('../../common/lambdas.js')

const MonqadeQueryBuilder = require("../lib");
const qbMonqade = new MonqadeQueryBuilder(fieldsWithTypes);


Object.keys(fieldsWithTypes).forEach(pathID=>{
    // MonqadeQueryBuilder.supportedTypes = ['date','number','string','boolean'];
    const dType = fieldsWithTypes[pathID].toLowerCase();
//      const operator = 'ne';
//      const operator = 'lt';
//      const operator = 'lte';
//      const operator = 'gt';
//      const operator = 'gte';
//     const operator = 'eq';
        const operator = 'nbetweenx';
//        const operator = 'nbetweeni';
// const operator = 'betweeni';
// const operator = 'like';
// const operator = 'nlike';
// const operator = 'in';
// const operator = 'nin';
    if(operator.match(/in/g)){
        switch(dType){
            case 'date':
                console.log(`qbMonqade[${operator}]('${pathID}',new Date('1974-06-29'))`,qbMonqade[operator](pathID, 1,2,'2018'));
                break;
            case 'number':
                console.log(`qbMonqade[${operator}]('${pathID}',1)`,qbMonqade[operator](pathID, 1,2,'2018'));
                break;
            case 'string':
                console.log(`qbMonqade[${operator}]('${pathID}','ding dong')`,qbMonqade[operator](pathID, 1,2,'2018'));
                break;
            case 'boolean':
                console.log(`qbMonqade[${operator}]('${pathID}',false)`,qbMonqade[operator](pathID, 1,2,'2018'));
                break;
            default:
                throw new Error(`${dType} for ${pathID} is unsupported type`);    
                break; // <-- never stops being funny.
        }
        // console.log(`qbMonqade[operator](pathID,new Date('1974-06-29'),new Date('2018-06-29'))`,
        //     qbMonqade[operator](pathID,new Date('1974-06-29'),new Date('2018-06-29'))
            
        //     );

    }else if(operator.match(/like/g)){
        switch(dType){
            case 'date':
                console.log(`qbMonqade[${operator}]('${pathID}',new Date('1974-06-29'))`,qbMonqade[operator](pathID,'myString'));
                break;
            case 'number':
                console.log(`qbMonqade[${operator}]('${pathID}',1)`,qbMonqade[operator](pathID,'myString'));
                break;
            case 'string':
                console.log(`qbMonqade[${operator}]('${pathID}','ding dong')`,qbMonqade[operator](pathID,'myString'));
                break;
            case 'boolean':
                console.log(`qbMonqade[${operator}]('${pathID}',false)`,qbMonqade[operator](pathID,'myString'));
                break;
            default:
                throw new Error(`${dType} for ${pathID} is unsupported type`);    
                break; // <-- never stops being funny.
        }
        // console.log(`qbMonqade[operator](pathID,new Date('1974-06-29'),new Date('2018-06-29'))`,
        //     qbMonqade[operator](pathID,new Date('1974-06-29'),new Date('2018-06-29'))
            
        //     );

    }else if(operator.match(/ween/g)){
        switch(dType){
            case 'date':
                console.log(`qbMonqade[${operator}]('${pathID}',new Date('1974-06-29'))`,qbMonqade[operator](pathID,new Date('1974-06-29'),new Date('2018-06-29')));
                break;
            case 'number':
                console.log(`qbMonqade[${operator}]('${pathID}',1)`,qbMonqade[operator](pathID,1,-8));
                break;
            case 'string':
                console.log(`qbMonqade[${operator}]('${pathID}','ding dong')`,qbMonqade[operator](pathID,'ding dong','red tree'));
                break;
            case 'boolean':
                console.log(`qbMonqade[${operator}]('${pathID}',false)`,qbMonqade[operator](pathID,false,false));
                break;
            default:
                throw new Error(`${dType} for ${pathID} is unsupported type`);    
                break; // <-- never stops being funny.
        }
        // console.log(`qbMonqade[operator](pathID,new Date('1974-06-29'),new Date('2018-06-29'))`,
        //     qbMonqade[operator](pathID,new Date('1974-06-29'),new Date('2018-06-29'))
            
        //     );

    }else{
        switch(dType){
            case 'date':
                console.log(`qbMonqade[${operator}]('${pathID}',new Date('1974-06-29'))`,qbMonqade[operator](pathID,new Date('1974-06-29')));
                break;
            case 'number':
                console.log(`qbMonqade[${operator}]('${pathID}',1)`,qbMonqade[operator](pathID,1));
                break;
            case 'string':
                console.log(`qbMonqade[${operator}]('${pathID}','ding dong')`,qbMonqade[operator](pathID,'ding dong'));
                break;
            case 'boolean':
                console.log(`qbMonqade[${operator}]('${pathID}',false)`,qbMonqade[operator](pathID,false));
                break;
            default:
                throw new Error(`${dType} for ${pathID} is unsupported type`);    
                break; // <-- never stops being funny.
        }
    }
    // console.log(`qbMonqade.ne('${pathID}','3')`,qbMonqade.ne(pathID,'3'));
    //console.log(`qbMonqade.eq('field1','3')`,qbMonqade.eq('field1','3'));
    
});
let findObject = qbMonqade.toFindObject();
console.log();

console.log(`qbMonqade.toFindObject()`,JSON.stringify( qbMonqade.toFindObject()), 'termCount:', qbMonqade.termCount());
console.log();
qbMonqade.defaultConjunctionOperator = 'or';
console.log(`qbMonqade.toFindObject()`,JSON.stringify( qbMonqade.toFindObject()), 'termCount:', qbMonqade.termCount());

// console.log("LAMBDAS.minMax(3,5)",LAMBDAS.minMax(3,5))
// console.log("LAMBDAS.minMax(5,3)",LAMBDAS.minMax(5,3))
// console.log("LAMBDAS.minMax(-5,3)",LAMBDAS.minMax(-5,3))
// console.log("LAMBDAS.minMax(-5,-3)",LAMBDAS.minMax(-5,-3))
// console.log("LAMBDAS.minMax(-5,0,3,1,-3)",LAMBDAS.minMax(-5,0,3,1,-3))
// console.log("LAMBDAS.minMax(-5)",LAMBDAS.minMax(-5))
// console.log("LAMBDAS.minMax()",LAMBDAS.minMax())

// console.log("LAMBDAS.minMax(3,5)",LAMBDAS.minMax(new Date('1974-06-29'),new Date('2018-06-29')))
// console.log("LAMBDAS.minMax(5,3)",LAMBDAS.minMax('apple','banana'))

//try using real fieldTypeValue run output does/will array work? 