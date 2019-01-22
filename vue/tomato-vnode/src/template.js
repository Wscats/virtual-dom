import VNode from './vnode'


export default function processTemplate(nodeId){
	let root = document.getElementById(nodeId)
	return generateVNode(root)

}

function generateVNode(node){
	if(node && node.nodeType){
		let attrObj = null
		if(node.nodeType===1){
			attrObj = {}
			for(let attr of node.getAttributeNames()){
				if(node.getAttribute(attr)){
					attrObj[attr] = node.getAttribute(attr)
				}
			}
		}
		let content = (node.nodeType===3||node.nodeType===8)?node.textContent:null
		if(node.childNodes && node.childNodes.length>0){
			var childVNodesList = []
			for(let i in node.childNodes){
				let chVNode =generateVNode(node.childNodes[i])
				if(chVNode){
					childVNodesList.push(chVNode)
				}
			}
		}

		return new VNode(node.tagName, node.nodeType,node.key || generateNodeKey(),attrObj,content,childVNodesList)
	} else {
		return null
	}

}


function generateNodeKey(){
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var chars = CHARS, uuid = new Array(36), rnd=0, r;
	for (var i = 0; i < 36; i++) {
		if (i==8 || i==13 ||  i==18 || i==23) {
			uuid[i] = '-';
		} else if (i==14) {
			uuid[i] = '4';
		} else {
			if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
			r = rnd & 0xf;
			rnd = rnd >> 4;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		}
	}
	return uuid.join('');
}