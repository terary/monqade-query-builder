

const MyClass = require('./classes/MyClass').MyClass;

const myClass = new MyClass();

console.log('myClass.pub();',myClass.pub());
console.log('myClass._privy();',myClass.privy());
console.log('myClass.pub();',myClass.pub());
console.log('myClass._privy();',myClass.privy());
console.log('myClass.pub();',myClass.pub());
console.log('myClass._privy();',myClass.privy());
console.log('myClass.pub();',MyClass.pub);
console.log('myClass._privy();',myClass.privy);
