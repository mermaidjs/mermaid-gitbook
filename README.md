# mermaid-gitbook

GitBook source code for [mermaid website](https://mermaidjs.github.io).


## Develop

```
yarn watch
open http://localhost:4000
```

Edit `markdown / images / styles` files in `content` folder.


## Release

Make sure you have cloned [mermaid website](https://mermaidjs.github.io) to the same parent folder as this project.

```
yarn release
cd ../mermaidjs.github.io && git commit -a && git push
```


## Todo

- Demos page has several rendering issues
