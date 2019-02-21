// 利用Reflect来读对象
let target = {
    _test: 1,
    get test() {
        return this._test;
    }
};
console.log("----get两个参数的情况----");
console.log(Reflect.get(target, "_test")); //1
console.log(Reflect.get(target, "test")); //1

// 参数一是被访问的对象； 参数二是属性名； 参数三当遇见getter时，将getter的this指向他
let receiver = {
    _test: 2
}
let target2 = {
    _test: 1,
    get test() {
        console.log(this === target, this === receiver);
        return this._test;
    }
};
console.log("----get三个参数的情况----");
// 通过Reflect.get调用时（且有第三个参数），this指向参数三
console.log(Reflect.get(target2, "test", receiver));
// false true
// 2
// 当通过target.test调用时，this指向对象本身
console.log(target2.test);
// true false
// 1

// 利用Reflect来写对象
// Reflect.set(target, propertyKey, value[, receiver])
let target3 = {
    _test: 1,
    get test() {
        return this._test;
    },
    set test(val) {
        this._test = val;
    }
};

console.log("----set设置对象的值----");
Reflect.set(target3, "test", "a"); //true
console.log(target3.test); //"a"

//修改setter的this指向目标
Reflect.set(target3, "test", "b", receiver); //true
console.log(target3.test); //"a"
console.log(receiver._test); //"b"

//修改被禁止修改的属性
Object.defineProperty(target3, "test", {
    value: 1
});
Reflect.set(target3, "test", "a"); //false
console.log(target3.test); //1


// Reflect.construct其实就是实例化构造函数，通过传参形式的实现， 执行的方式不同， 效果其实一样， construct的第一个参数为构造函数， 第二个参数由参数组成的数组或者伪数组 
// 所以Reflect.consturct和new 构造函数是一样， 至少到目前为止..
function func1(a, b, c) {
    this.sum = a + b + c;
}

const args = [1, 2, 3];
const object1 = new func1(...args);
const object2 = Reflect.construct(func1, args);
console.log("----实例化构造函数，两个参数(相当于new)----");
console.log(object2.sum);
// expected output: 6

console.log(object1.sum);
// expected output: 6

// Reflect.construct()方法的行为有点像 new操作符构造函数 ， 相当于运行 new target(...args)
// 所以下面两句是等价的
// var obj = new Foo(...args);
// var obj = Reflect.construct(Foo, args);

// Reflect.construct(target, argumentsList[, newTarget])
// target被运行的目标函数argumentsList调用构造函数的数组或者伪数组newTarget可选该参数为构造函数， 参考new.target操作符，如果没有newTarget参数， 默认和target一样
var Fn = function() {
    this.attr = [1];
};
var Person = function() {
};
Person.prototype.run = function() {
};
// 
console.log("----实例化构造函数并继承，三个参数(相当于new)----");
console.log(Reflect.construct(Fn, [], Person)); //这种写法就不需要在Person里面写Fn.call(this)了


var Fn1 = function() {
    this.attr = [1];
};
var Person1 = function() {
    Fn1.call(this)
};
Person1.prototype.run = function() {
};
console.log(new Person1()); //等价于上面的Reflect.construct(Fn, [], Person)