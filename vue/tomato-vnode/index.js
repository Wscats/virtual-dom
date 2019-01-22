import processTemplate from './src/template'
import VNode from './src/vnode'
import diff from './src/diff'
import patch from './src/patch'

window.tomato = {
	VNode,
	diff,
	patch,
	processTemplate
}
console.log(tomato)
