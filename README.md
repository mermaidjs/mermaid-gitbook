# mermaid-gitbook 文档简体中文版

GitBook source code for [mermaid website](https://mermaidjs.github.io).


## 配置

```
yarn install
```

如果没有安装过 gitbook，请自行安装 gitbook。同时在 content 目录中执行 `gitbook update`。

## 开发

```
yarn watch
open http://localhost:4000
```

Edit `markdown / images / styles` files in `content` folder.


## 发布

For those who have the permission:

Make sure you have cloned [mermaid website](https://github.com/mermaidjs/mermaidjs.github.io) to the same parent folder as this project.

```
yarn release
cd ../mermaidjs.github.io && git commit -a -m 'Update doc' && git push
```
