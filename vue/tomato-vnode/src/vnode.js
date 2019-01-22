export default class VNode {
	
		constructor (tag, nodeType,key, props, text, children){
			this.tag = tag
			this.nodeType = nodeType
			this.key = key
			this.props = props
			this.text = text
			this.children = children
		}
	
		render(){
			var el
			if(this.nodeType===1){
				el = document.createElement(this.tag)
				for(let prop in this.props){
					setAttr(el,prop,this.props[prop])
				}
				if(this.children){
					this.children.forEach(function(ch,i){
						el.appendChild(ch.render())
					})
	
				}
			} else if(this.nodeType===3){
				el = document.createTextNode(this.text)
			} else if(this.nodeType===8){
				el = document.createComment(this.text)
			}
			el.key = this.key
			return el
	
		}
	}
	
	function setAttr(node,key,value){
		if(key==='style'){
			for(let val in value){
				node.style[val] = value[val]
			}
		} else {
			node.setAttribute(key,value)
		}
	}