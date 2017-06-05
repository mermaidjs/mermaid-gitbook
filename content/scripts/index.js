let url = null

setInterval(() => {
  if (url !== window.location.href) {
    url = window.location.href
    window.mermaid.init(undefined, document.querySelectorAll('.lang-mermaid'))
  }
}, 1000)
