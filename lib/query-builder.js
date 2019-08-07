"use strict";

// const  = require()
// const LAMBDAS = require('../../common/lambdas.js')
const LAMBDAS = require('monqade-shared').LAMBDAS;

 class  MonqadeQueryBuilder{
    // will quietly dismiss bad additions, return undefined.
    // eg:  (someDate).eq('non-date value')

    constructor(pathsAndTypes){
        // pathsAndTypes = {fieldName1:dataType,fieldName2:dataType,...}
        if(! LAMBDAS.isObject(pathsAndTypes) || Object.keys(pathsAndTypes).length==0){
            throw new Error("MonqadeQueryBuilder requires instantiation with list of paths with type");
        }
        this._pathsAndTypes =pathsAndTypes;
        //this._useStrict = true;
        this._useStrict =false;
        this._init();     
        this._terms = [];
        this._defaultConjunctionOperator = '$and';
    }
    _isValidType(dType){
        return MonqadeQueryBuilder.supportedTypes.indexOf(dType.toLowerCase()) > -1;
    }
    _hasValidType(pathID){
        const dType = this._pathsAndTypes[pathID];
        return MonqadeQueryBuilder.supportedTypes.indexOf(dType.toLowerCase()) > -1;
    }
    // _hasValidTypeForIn(pathID){
    //     const dType = this._pathsAndTypes[pathID];
    //     return MonqadeQueryBuilder.supportedTypes .indexOf(dType.toLowerCase()) > -1;
    // }
    _hasValidTypeForBetween(pathID){
        const dType = this._pathsAndTypes[pathID];
        return MonqadeQueryBuilder.validBetweenTypes.indexOf(dType.toLowerCase()) > -1;
    }
    _hasValidTypeForRegExp(pathID){
        const dType = this._pathsAndTypes[pathID];
        return MonqadeQueryBuilder.validRegExpTypes.indexOf(dType.toLowerCase()) > -1;
    }
    _init(){
        Object.entries(this._pathsAndTypes).forEach(([pathID,dataType])=>{

            if( ! this._isValidType(dataType.toLowerCase())){
             this._error(`Path: '${pathID}' has unsupported type of '${dataType}'. `);   
            }
        })

    }
    set defaultConjunctionOperator(andOr){
        // only support 'and' 'or' 
        // all other disregarded and default remains unchanged.

        if(andOr == 'and'){
            this._defaultConjunctionOperator = '$and';
        }else if(andOr == 'or'){
            this._defaultConjunctionOperator = '$or';
        }
    }
    get defaultConjunctionOperator(){
        return this._defaultConjunctionOperator;
    }
/*
    x_eq(fieldName,value){
        if( ! this._hasValidType(fieldName)){
            return this._error(`Path: '${fieldName}' does not have valid type. `);   
        }

        if( ! this._pathsAndTypes[fieldName]){
            return this._error(`FieldName: '${fieldName}' was not declared at instantiation `);
        }

        const dataType = value.constructor.name.toLowerCase();
        if(  this._pathsAndTypes[fieldName].toLowerCase() !== dataType ){
            return this._error(`Value of '${fieldName}' has type of '${dataType}' but was declared as ${this._pathsAndTypes[fieldName]}. must be same type as declared`);
        }

        let term  = Object.create({});// think it's faster then JSON.parse
        term[fieldName] = value;

        this._terms.push(term);
        return term;

    }    
*/
    // simple {fieldName:{op:value}}    
    ne(fieldName,value){
        return this._defaultExpression(fieldName,'$ne',value); 
    }
    eq(fieldName,value){
        return this._defaultExpression(fieldName,'$eq',value); 
    }
    lt(fieldName,value){
        return this._defaultExpression(fieldName,'$lt',value); 
    }    
    lte(fieldName,value){
        return this._defaultExpression(fieldName,'$lte',value); 
    }    
    gt(fieldName,value){
        return this._defaultExpression(fieldName,'$gt',value); 
    }    
    gte(fieldName,value){
        return this._defaultExpression(fieldName,'$gte',value); 
    }    
    like(fieldName,value){
        if( ! this._hasValidTypeForRegExp(fieldName)){
            return this._error(`Path: '${fieldName}' can not be used for RegularExpression operations. `);   
        }
        return this._defaultExpression(fieldName,'$regex',new RegExp(value,"i")); 
    }    
    nlike(fieldName,value){
        if( ! this._hasValidTypeForRegExp(fieldName)){
            return this._error(`Path: '${fieldName}' can not be used for RegularExpression operations. `);   
        }
        return this._defaultExpression(fieldName,'$not',new RegExp(value,"i")); 
    }

    _defaultExpression(fieldName,conditionOperator,value){
        if( ! this._pathsAndTypes[fieldName]){
            return this._error(`FieldName: '${fieldName}' was not declared at instantiation `);
        }
        const dataType = value.constructor.name.toLowerCase();
        if(  this._pathsAndTypes[fieldName].toLowerCase() !== dataType && value.constructor.name !== 'RegExp' ){
            return this._error(`Value of '${fieldName}' has type of '${dataType}' but was declared as ${this._pathsAndTypes[fieldName]}. must be same type as declared`);
        }
        if( ! this._hasValidType(fieldName)){
            return this._error(`Path: '${fieldName}' does not have valid type. `);   
        }

        let insideTerm  = Object.create({});// think it's faster then JSON.parse
        let outsideTerm  = Object.create({});//  

        insideTerm[conditionOperator] = value;
        outsideTerm[fieldName] = insideTerm;

        this._terms.push(outsideTerm);

        return outsideTerm;
    }
//*********************************** */
    nin(fieldName,... value){
        return this._inInner(fieldName,'$nin', value)
    }

    in(fieldName, ... values){
        return this._inInner(fieldName,'$in', values)
    }    
    _inInner(fieldName,op,  values){
        // if(!Array.isArray(valuesArray)){
        //     return _error('Value is not an array type. ');
        // }
        
        if( ! this._hasValidType(fieldName)){
            return this._error(`Path: '${fieldName}' can not be used for *between* operations. `);   
        }

        const termObj = Object.create({}), innerTerm= Object.create({});
        innerTerm[op] = values;
        termObj[fieldName] = innerTerm;
        this._terms.push(termObj);
        return termObj;
    }
//********************************** */
    // between
    betweenx(fieldName,... values){
        return this._between(fieldName,'$gt','$lt',values);
    }
    between(fieldName,... values){
        return this.betweenx(fieldName, ... values); 
    }
    betweeni(fieldName,...values){
        return this._between(fieldName,'$gte','$lte',values);
    }
    _between(fieldName,minOp,maxOp, ... values){
        if( ! this._hasValidTypeForBetween(fieldName)){
            return this._error(`Path: '${fieldName}' can not be used for *between* operations. `);   
        }

        let termObj = Object.create({});
        termObj[fieldName] = this._betweenTerm(minOp,maxOp,...values);
        this._terms.push(termObj);

        return termObj;

    }

    // before going any fruther refactor these two
    nbetweeni(fieldName, ... values){
        return this._nbetweenTerm(fieldName,'$gte','$lte',values);
    }
    nbetweenx(fieldName, ... values){
        return this._nbetweenTerm(fieldName,'$gt','$lt',values);
    }
    nbetween(fieldName, ... values){
        return this.nbetweenx(fieldName, ...values)
    }
    _nbetweenTerm(fieldName,minOp,maxOp, ... values){
        if( ! this._hasValidTypeForBetween(fieldName)){
            return this._error(`Path: '${fieldName}' can not be used for *between* operations. `);   
        }
        let termObj = Object.create({});
        termObj[fieldName] = this.not(this._betweenTerm(minOp,maxOp, ...values))
        this._terms.push(termObj);
        return termObj;
    }

    _betweenTerm(minOp,maxOp, ...values){
        
        let mm =LAMBDAS.minMax.apply(null,...values);
        let term = Object.create({});
        term[minOp] = mm.min;
        term[maxOp] = mm.max;
        return term;
    }
// misc
    not(value){
        return {'$not':value};
    }
 

// term collection things
    termCount(){
        return this._terms.length;
        //return this._termCount;
    }
    toFindObject(andOr ='and'){
        return this._termsToExpression(this.defaultConjunctionOperator,this._terms);
    }

    termsToExpressionOr(terms = this._terms){
        console.log('this and the "and" have not been tested');
        return this._termsToExpression('$or',terms)
    }
    termsToExpressionAnd(terms = this._terms){
        return this._termsToExpression('$and',terms)
    }
    _termsToExpression(op,terms){
        if(!terms || terms.length ==0){
            return  {};
          } else if(terms.length==1){
            return terms[0];
          } else {
            let exp = Object.create({});
            exp[op] = terms;
            return exp;
          } 
    }



    _error(message){
        if( this._useStrict){
            throw new Error(message);
        }else{
            return undefined;
        }
    }



}
MonqadeQueryBuilder.supportedTypes = ['date','number','string','boolean'];
MonqadeQueryBuilder.validBetweenTypes = ['date','number'];
MonqadeQueryBuilder.validRegExpTypes = ['string']; // can't imagine another
module.exports = MonqadeQueryBuilder;

