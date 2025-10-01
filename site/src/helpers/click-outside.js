export function clickOutside(node) {

    const handleMousedown = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click-outside', node)
            )
        }
    }

    document.addEventListener('mousedown', handleMousedown, true);

    return {
        destroy() {
            document.removeEventListener('mousedown', handleMousedown, true);
        }
    }
}
