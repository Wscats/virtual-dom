
export function isSomeTypeNode(node1,node2){
    if(node1.nodeType===node2.nodeType){
        return true
    } else {
        return false
    }
}

export const TEXT = 'TEXT'
export const PROP = 'PROP'
export const MOVE = 'MOVE'
export const INSERT = 'INSERT'
export const REMOVE = 'REMOVE'