let url = null

setInterval(() => {
  if (url !== window.location.href) {
    url = window.location.href
    document.querySelectorAll('.lang-mermaid').forEach(node => {
      console.log(node)
      const newNode = node.cloneNode(true)
      newNode.removeAttribute('class')
      const hr = document.createElement('hr')
      node.parentNode.insertBefore(hr, node)
      node.parentNode.insertBefore(newNode, hr)
    })
    window.mermaid.init(undefined, document.querySelectorAll('.lang-mermaid'))
  }
}, 1000)
