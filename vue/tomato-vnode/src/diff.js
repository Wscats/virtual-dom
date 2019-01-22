import {isSomeTypeNode,TEXT,PROP,MOVE,INSERT,REMOVE} from './util'
import vnode from './vnode'

var directives = {}

export default function diff(oldVNode, newVNode){
    let index = 0
    directives = {}
    diffVNode(oldVNode,newVNode,directives)
    console.log(directives)
    return directives

}

function diffVNode(oldVNode,newVNode){

    if(newVNode && isSomeTypeNode(oldVNode,newVNode)){
        if(newVNode.nodeType===3 || newVNode.nodeType===8){
            if(oldVNode.text !== newVNode.text){
                addDirectives(newVNode.key,{type:TEXT, content: newVNode.text})
            }
        } else if(newVNode.nodeType===1){
            if(oldVNode.tag === newVNode.tag && oldVNode.key == newVNode.key){
                var propPatches = diffProps(oldVNode.props, newVNode.props)
                if(Object.keys(propPatches).length>0){
                    addDirectives(newVNode.key,{type:PROP, content: propPatches})
                }
                if(oldVNode.children || newVNode.children)
                    diffChildren(oldVNode.children,newVNode.children,newVNode.key)
            }
        }
    }
    return directives
}

function diffProps(oldProps,newProps){
    let patches={}
    if(oldProps){
        Object.keys(oldProps).forEach((prop)=>{
            if(prop === 'style' && newProps[prop]){
                let newStyle = newProps[prop]
                let isSame = true
                Object.keys(oldProps[prop]).forEach((item)=>{
                    if(prop[item] !== newStyle[item]){
                        isSame = false
                    }
                })
                if(isSame){
                    Object.keys(newStyle).forEach((item)=>{
                        if(!prop.hasOwnProperty(item)){
                            isSame = false
                        }
                    })
                }
                if(!isSame)
                    patches[prop] = newProps[prop]
            }
            if(newProps[prop] !== oldProps[prop]){
                patches[prop] = newProps[prop]
            }
        })
    }
    if(newProps){
       Object.keys(newProps).forEach((prop)=>{
        if(!oldProps.hasOwnProperty(prop)){
            patches[prop] = newProps[prop]
        }
    })
   }
   
    return patches
}

function diffChildren(oldChildren,newChildren,parentKey){
    oldChildren = oldChildren || []
    newChildren = newChildren || []
    let movedItem = []
    let oldKeyIndexObject = parseNodeList(oldChildren)
    let newKeyIndexObject = parseNodeList(newChildren)
    for(let key in newKeyIndexObject){
        if(!oldKeyIndexObject.hasOwnProperty(key)){
            addDirectives(parentKey,{type:INSERT,index:newKeyIndexObject[key],node:newChildren[newKeyIndexObject[key]]})
        }
    }
    for(let key in oldKeyIndexObject){
        if(newKeyIndexObject.hasOwnProperty(key)){
            if(oldKeyIndexObject[key] !== newKeyIndexObject[key]){
                let moveObj = {'oldIndex':oldKeyIndexObject[key],'newIndex':newKeyIndexObject[key]}
                movedItem[newKeyIndexObject[key]] = oldKeyIndexObject[key]
            }
            diffVNode(oldChildren[oldKeyIndexObject[key]],newChildren[newKeyIndexObject[key]])
        } else {
            addDirectives(key,{type:REMOVE,index:oldKeyIndexObject[key]})
        }
    }
    if(movedItem.length>0){
        addDirectives(parentKey,{type:MOVE, moved:movedItem})
    }
    
}

function parseNodeList(nodeList){
    let keyIndex = {}
    nodeList.forEach((item,i)=>{
        if(item.key){
            keyIndex[item.key] = i
        }
       
    })
    return keyIndex

}

function addDirectives(key, obj){
    directives[key] = directives[key] || []
    directives[key].push(obj)
}
