# mermaid-gitbook([Chinese Edition](content/zh-cn/README.md))

GitBook source code for [mermaid website](https://mermaidjs.github.io).

## Setup

```
yarn install
```

If you doesn't install `gitbook`, install it by your self. then execute:

```
cd content && gitbook update
```

## Develop

```
yarn watch
open http://localhost:4000
```

Edit `markdown / images / styles` files in `content` folder.


## Release

For those who have the permission:

Make sure you have cloned [mermaid website](https://github.com/mermaidjs/mermaidjs.github.io) to the same parent folder as this project.

```
yarn release
cd ../mermaidjs.github.io && git commit -a -m 'Update doc' && git push
```
