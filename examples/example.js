"use strict";

const path = require('path');
var scriptName = path.basename(__filename);

const MonqadeQueryBuilder = require("../");

const operationsIN =['in','nin'];
const operationsBETWEEN = ['between','betweenx','betweeni','nbetween','nbetweenx','nbetweeni'];
const operationsEQ = ['eq','ne'];
const operationsGtLt =  ['lt','lte','gt','gte'];
const operationsLIKE =['like','nlike'];

// const fieldDeclaration = { aString: 'String', aNumber: 'Number',aDate: 'Date',anObject: 'Object',anArry: 'Array' };
const fieldDeclaration = { anObject: 'Object',anArry: 'Array', aString: 'String', aNumber: 'Number',aDate: 'Date'};
// const fieldDeclaration = {  aNumber: 'Number',aDate: 'Date'};

// const mqQueryBuilder = new MonqadeQueryBuilder(fieldDeclaration);

const mqQB = new MonqadeQueryBuilder(fieldDeclaration);
const testArgs = {
    in:{
        string:['string1','string2','string3'],
        date:[new Date('2018-12-25'), new Date('1974-06-29'), new Date('1984-07-04')],
        number:[1,2,3,4],
        array:[[1,2],[2,3],[3,4]],
        object:[{obj1:'one'},{obj2:'two'},{obj3:'three'}]
    },
    like:{
        string:'string1',
        date: new Date('2018-12-25'),
        number: 3,
        array:[1,2,3],
        object:{obj1:'one'}
    },
    gtlt:{
        string:'apple',
        date: new Date('2018-12-25'),
        number: 3,
        array:[1,2,3],
        object:{obj1:'one'}
    },
    eqne:{
        string:'apple',
        date: new Date('2018-12-25'),
        number: 3,
        array:[1,2,3],
        object:{obj1:'one'}
    },
    between:{
        string:['apple','orange'],
        date: [new Date('2018-12-25'),new Date('2017-12-25'),new Date('2016-12-25')],
        number: [3,0,-3,1],
        array:[[1],[2],[3]],
        object:[{obj1:'one'},{obj2:'two'},{obj3:'three'}]
    }


}


// console.log(usageMessage());
let dTypeOfInterest = process.argv[2] || 'help';
let displayFields = {};
switch(dTypeOfInterest.toLowerCase()){
    case 'number':    
        displayFields['aNumber'] ='Number';
        showExamples()
        break;
    case 'string':    
        displayFields['aString'] ='String';
        showExamples()
        break;
    case 'date':    
        displayFields['aDate'] ='Date';
        showExamples()
        break;
    case 'object':    
        displayFields['anObject'] ='Object';
        showExamples()
        break;
    case 'array':    
        displayFields['anArray'] ='Array';
        showExamples()
        break;
    case 'all':
        displayFields =fieldDeclaration;
        showExamples()
        console.log(usageMessage());
        break;
    case 'example1':
        console.log(example1.toString());
        example1();
        break
    case 'example2':
        console.log(example2.toString());
        example2();
        break
    default:
        console.log(usageMessage());
        break;

}

function showExamples(){
    Object.entries( displayFields).forEach(([fieldID,fieldType])=>{
        let progress = `Working datatype: ${fieldType}:\n`;
        operationsIN.forEach(operator=>{
            const args = testArgs['in'][fieldType.toLowerCase()] ;
            const myThing = mqQB;
            progress+= `\t${operator}   mqQueryBuilder.${operator}('${fieldID}',${args.join(',')}) -> ` + JSON.stringify(mqQB[operator](fieldID,args)||'not defined')+ `\n`;
        });  // foreach: operationIN
        progress+="\n";

        operationsLIKE.forEach(operator=>{
            // because regExp is only valid for strings and regEx do not convert easily to printable (stringify andy console covert {})
            const args = testArgs['like'][fieldType.toLowerCase()] ;
            const myThing = mqQB[operator](fieldID,args);
            if(fieldType.toLowerCase() === 'string'){
                if(myThing[fieldID] && myThing[fieldID]['$regex']){
                    myThing[fieldID]['$regex'] = myThing[fieldID]['$regex'].toString();
                    progress+= `\t${operator}   mqQueryBuilder.${operator}('${fieldID}',${args}) -> ` + JSON.stringify(myThing||'not defined')+ `\n`;
                    // pass test
                } else if(myThing[fieldID] && myThing[fieldID]['$not']){
                    myThing[fieldID]['$not'] = myThing[fieldID]['$not'].toString();
                    progress+= `\t${operator}   mqQueryBuilder.${operator}('${fieldID}',${args}) -> ` + JSON.stringify(myThing||'not defined')+ `\n`;
                    // pass test
                } else{
                    console.log('My thing, aint even a thing');
                    // fail test
                }
            }else{
                progress+= `\t${operator}   mqQueryBuilder[${operator}](${fieldID},${args}) -> ` + JSON.stringify(mqQB[operator](fieldID,args)||'not defined')+ `\n`;
                // pass 
            }
        });  // foreach: operationLIKE
        progress+="\n";
    
        operationsGtLt.forEach(operator=>{
            const args = testArgs['gtlt'][fieldType.toLowerCase()] ;
            progress+= `\t${operator}   mqQueryBuilder.${operator}('${fieldID}',${JSON.stringify(args)}) -> ` + JSON.stringify(mqQB[operator](fieldID,args)||'not defined')+ `\n`;
        });  // foreach: operationsGtLt
        progress+="\n";
    
        operationsEQ.forEach(operator=>{
            const args = testArgs['eqne'][fieldType.toLowerCase()] ;
            progress+= `\t${operator}   mqQueryBuilder.${operator}('${fieldID}',${JSON.stringify(args)}) -> ` + JSON.stringify(mqQB[operator](fieldID,args)||'not defined')+ `\n`;
        });  
        progress+="\n";

        operationsBETWEEN.forEach(operator=>{
            const args = testArgs['between'][fieldType.toLowerCase()] ;
            progress+= `\t${operator}   mqQueryBuilder.${operator}('${fieldID}',${JSON.stringify(args)}) -> ` + JSON.stringify(mqQB[operator](fieldID,...args)||'not defined')+ `\n`;
        });  
        progress+="\n";
        
        
    
        console.log(progress);
        console.log("");
    })// forEach fieldDeclaration
    console.log('mqQB.toFindObject() ->', JSON.stringify(mqQB.toFindObject()));
    console.log("");
    console.log("");
}//showExamples 


function usageMessage(){
    return `
        node ${path.basename(__filename)} [${Object.values(fieldDeclaration).join('|')} | all | example1, example2, example3]

        note: Object and Array are not support. Here only to demonstration
        each call pushes term to then internal stack and returns the created term.
        
        if there is an error undefined is returned and nothing goes on the stack.

        
        calls to: 

        termCount() ->  [number] number of terms on the stack.
        termsToExpressionOr() -> [object] stack of terms or'd  
        termsToExpressionAnd() -> [object] stack of terms and'd

        toFindObject(['and'|'or']) ->  [object] stack of terms [and|or]'d
            *alias for 'termsToExpressionAnd'/'termsToExpressionOr'

        termCount & toFindObject fulfill Monqade.search object criteria (in other languages it would implement the interface)
    `;
}

function example1(){
    `
        simple example - how to use.    
    `;

    //Set-up
    const MonqadeQueryBuilder = require("../lib");
    const fieldDeclaration = { 
        city: 'String', 
        aNumber: 'Number',
        hireDate: 'Date',
        lastReviewDate: 'Date'};
    const mqQB = new MonqadeQueryBuilder(fieldDeclaration);
        
    //add terms
    mqQB.in('city','Dallas','Houston','El Paso');
    mqQB.lt('hireDate',new Date('2018-01-01'));

    //get object suitable for mongoose find()
    console.log('mqQB.termCount: ',mqQB.termCount());
    const mongooseFindObject= mqQB.toFindObject();

    console.log('mongooseFindObject:',JSON.stringify(mongooseFindObject));

}
function example2(){
    `
        simple example - how to use.    
    `;

    //Set-up
    const MonqadeQueryBuilder = require("../lib");
    const fieldDeclaration = { 
        city: 'String', 
        aNumber: 'Number',
        someObject:'Object',
        hireDate: 'Date',
        lastReviewDate: 'Date'};
    const mqQB = new MonqadeQueryBuilder(fieldDeclaration);
        
    //add terms
    mqQB.in('city','Dallas','Houston','El Paso');
    mqQB.betweenx('hireDate',new Date('2017-01-01'),new Date('2017-06-01'));
    mqQB.lt('lastReviewDate',new Date('2018-01-01'));

    mqQB.eq('someObject','all values will be dismissed -- objects not supported');
        //    ^--- gets ignored, returning undefined  


    //get object suitable for mongoose find()
    const mongooseFindObject= mqQB.toFindObject();
    console.log('mqQB.termCount: ',mqQB.termCount());
    console.log('mongooseFindObject: ',JSON.stringify(mongooseFindObject));

}
