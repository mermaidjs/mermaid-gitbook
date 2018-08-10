# 更新记录

### 下面是些更改从历史版本到最新版本：

## #1

```javascript
mermaid.initialize({
    sequenceDiagram:{
        ...
    }
})
```

更改为：

```javascript
mermaid.initialize({
    sequence:{
        ...
    }
})
```

## #2

在老版本中加入样式您需要编辑您的 HTML ：

```html
<link rel="stylesheet" href="mermaid.min.css">
```

或者

```html
<link rel="stylesheet" href="mermaid.forest.min.css">
```

现在不需要这样子做了，同时在新版本发布包中已经不提供单独的 CSS 样式。

新版本中，您只需要：

```javascript
mermaid.initialize({
    theme: 'forest'
})
```

这样子就可以搞定了。这是因为了迁移方便的考虑，CSS 已经内联到了 SVG 中。
