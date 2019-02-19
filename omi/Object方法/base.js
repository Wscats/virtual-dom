let proto = {};
let obj = {
    x: 10
};
Object.setPrototypeOf(obj, proto);

proto.y = 20;
proto.z = 40;

obj.x // 10
obj.y // 20
obj.z // 40
console.log("---setPrototypeOf会把对象的属性值继承到原型链上--")
console.log(obj);

// 该方法等同于下面的函数。
// function setPrototypeOf(obj, proto) {
//     obj.__proto__ = proto;
//     return obj;
// }