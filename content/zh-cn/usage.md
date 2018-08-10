# 使用

## 安装

### npm 包管理

```
yarn add mermaid
```

### CDN

https://unpkg.com/mermaid/

请注意您可以从下方的下拉框中选择对应的版本。

## 在 Web 页中简单的使用

最简单在 Web 页面中内嵌 Mermaid 只需要两个元素：

1. 使用 script 标签内嵌 Mermaid 框架到 HTML 页面中；
2. 在 Web 页面中定义图形。

如果这些元素已经被正确的加载，同时在页面载入以后就会被触发，框架会渲染页面中已经定义的图形到 SVG 文件。

### 在页面中集成 Mermaid 库

```html
<script src="mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true});</script>
```

然后，Mermaid 会找到页面中带有 `class="mermaid"` 元素的标签，然后尝试读取标签里面图表描述的内容，并渲染然后替换为 SVG 图表。

###  定义个图形描述类似这样：

```html
<div class="mermaid">
    CHART DEFINITION GOES HERE
</div>
```

然后最终渲染为这样：

```html
<div class="mermaid" id="mermaidChart0">
    <svg>
        Chart ends up here
    </svg>
</div>
```

元素渲染以后的 id 为 Mermaid 自动添加。


### 下面是简单的完整例子：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="mermaid.min.css">
</head>
<body>
  <div class="mermaid">
  graph LR
      A --- B
      B-->C[fa:fa-ban forbidden]
      B-->D(fa:fa-spinner);
  </div>
  <script src="mermaid.min.js"></script>
  <script>mermaid.initialize({startOnLoad:true});</script>
</body>
</html>
```

### 异步初始化

如果您使用了动态加载的内容，例如 CSS、Google Fonts 等外部资源，Mermaid 需要等页面全部加载完毕了以后再初始化（DOM 以及相关的资源，例如字体文件）。

```javascript
$(document).load(function() {
    mermaid.initialize();
});
```

或者

```javascript
$(document).ready(function() {
    mermaid.initialize();
});
```

这样子绑定了以后并不会立马在页面中渲染，默认情况下 Mermaid 会在 windows.load 事件回调中才开始渲染。


### 调用 `mermaid.init`

在默认情况下，在页面准备好了以后，`mermaid.init` 方法会查找带有 `class="mermaid"` 的元素标签。如果内容是在 Mermaid 加载以后或者需要自己手动控制，您必须手动初始化（`init`） Mermaid 。

- 已配置的对象；
- 一些节点，例如：
  - 一个节点；
  - 一串数组类型的节点；
  - W3C 类型的 selector 描述符。

例如：

```javascript
mermaid.init({noteMargin: 10}, ".someOtherClass");
```

或者，如果没有配置（使用默认配置），然后带入 jQuery 返回的节点列表：

```javascript
mermaid.init(undefined, $("#someId .yetAnotherClass"));
```

> **Warning** 出于兼容方面的考虑，一些内嵌载入方式已经不是很适用，建议使用 mermaidAPI 替代。

## 使用 webpack

Mermaid 完全支持 webpack 打包，详细参见[这里的 DEMO](https://github.com/mermaidjs/mermaid-webpack-demo)。


## 使用 API

主要的 API 设计思想就是使用渲染方法（`render function`）将字符串渲染为预期的图像。渲染方法使用回调将字符串渲染成对应的 svg 代码，源字符串可以来自站点的用户输入（例如 textarea 中），然后在站点的指定地方渲染为图像。

如果需要实现这样的功能，那么就应该使用 `mermaidAPI` 替换 `mermaid.js` 文件，然后两面的例子展示如何调用，例子中渲染成生的 svg 源代码打印在控制台中。

```html
<script src="mermaidAPI.js"></script>

<script>
    mermaidAPI.initialize({
        startOnLoad:false
    });
    $(function(){
        // Example of using the API
        var element = document.querySelector("#graphDiv");

        var insertSvg = function(svgCode, bindFunctions){
            element.innerHTML = svgCode;
        };

        var graphDefinition = 'graph TB\na-->b';
        var graph = mermaidAPI.render('graphDiv', graphDefinition, insertSvg);
    });
</script>
```


### 绑定事件

有些场景下，图形会在一定的条件下才会触发渲染，例如有个提示框然后用户触发点击事件。那么可能需要对应的回调函数在生成图像，同时在插入 DOM 的时候触发。

下面的例子展示了如何使用 mermaid 对应的 API，这个回调会在对应的节点生成 SVG 代码以后触发。

```javascript
var insertSvg = function(svgCode, bindFunctions) {
    element.innerHTML = svgCode;
    if(typeof callback !== 'undefined'){
        callback(id);
    }
    bindFunctions(element);
};

var id = 'theGraph';

mermaidAPI.render(id, txt, insertSvg, element);
```

1. 图形是使用手动渲染调用生成的；
2. 在生成渲染调用了样子，会调用回调函数去执行，在这里这个函数的名称被称作 `insertSvg`；
3. 回调函数有两个参数，一个是已生成的 svg 代码，另外个是回调本身。这个回调函数会在 svg 插入 DOM **以后**触发执行；
4. 在 DOM 中插入对应的 svg 代码；
5. 在绑定事件中调用绑定回调。


## 已标记渲染的例子

下面的例子是某个 Markdown 解析器在解析完成为 HTML 代码以后的再调用 Mermaid 解析器的例子：

```javascript
var renderer = new marked.Renderer();
renderer.code = function (code, language) {
    if(code.match(/^sequenceDiagram/)||code.match(/^graph/)){
        return '<div class="mermaid">'+code+'</div>';
    }
    else{
        return '<pre><code>'+code+'</code></pre>';
    }
};
```

另外个例子是使用 coffeescript 生成加载 mermaid 的 script 标签然后再去执行。

```CoffeeScript
marked = require 'marked'

module.exports = (options) ->
  hasMermaid = false
  renderer = new marked.Renderer()
  renderer.defaultCode = renderer.code
  renderer.code = (code, language) ->
    if language is 'mermaid'
      html = ''
      if not hasMermaid
        hasMermaid = true
        html += '<script src="'+options.mermaidPath+'"></script>'
      html + '<div class="mermaid">'+code+'</div>'
    else
      @defaultCode(code, language)

  renderer
```


## 进阶使用

**错误处理**

如果解析错误，则会调用 **mermaid.parseError** 方法，这样子就可以控制在渲染出错的情况下去进行业务方面的处理。

**仅仅解析不需要渲染**

有个场景下，就是仅仅需要解析不需要渲染，例如仅仅是检查语法。函数 **mermaid.parse(txt)** 会解析对应的带入的字符串参数，然后返回布尔值表示渲染是否成功（true 是成功，false 则是失败）。注意，如果解析出错还是会触发 `parseError` 的错误。

下面的例子展示了如何使用上述的方法：

```javascript
mermaid.parseError = function(err,hash){
    displayErrorInGui(err);
};

var textFieldUpdated = function(){
    var textStr = getTextFromFormField('code');

    if(mermaid.parse(textStr)){
        reRender(textStr)
    }
};

bindEventHandler('change', 'code', textFieldUpdated);
```


## 配置

Mermaid 可以使用多种配置项来定制化需要的渲染图形。目前，有下面几种配置方式：

1. 在初始化的时候带入对应的配置项；
2. <del>deprecated 使用全局的 mermaid 对象（已废弃）</del>；
3. <del>deprecated 使用全局的 mermaid_config 对象（已废弃）</del>；
4. 在调用 **mermaid.init** 方法的时候传入配置项。

其实在上述传入配置项中只有两个选项，已废弃的选项会被逐渐的移除。详细的配置项目可以参见[对应 mermaidAPI 文档](zh-cn/mermaidAPI.html)。


## 使用 `mermaidAPI.initialize`/`mermaid.initialize` 调用

比较推荐的方式是在初始化的时候显示调用 mermaid 或者 mermaidAPI 初始化方法传入对应的配置项：

```html
<script src="../dist/mermaid.js"></script>
<script>
    var config = {
        startOnLoad:true,
        flowchart:{
            useMaxWidth:false,
            htmlLabels:true
        }
    };
    mermaid.initialize(config);
</script>
```

> **Success** 这是比较推荐的传入配置 Mermaid 的方式


## 使用 mermaid 对象（已废弃）

可以使用传入对应的参数定制 mermaid 本身，主要有两个参数：

* mermaid.startOnLoad
* mermaid.htmlLabels

```
mermaid.startOnLoad = true;
```

> **Warning** 这个方式已经被废弃，请使用上述推荐的方式传入参数初始化。目前这块的接口只是为了兼容老版本的方案。


## 使用 mermaid_config 配置（已废弃）

还有种方式就是使用全局的 mermaid_config 对象配置，例如：

* mermaid_config.startOnLoad
* mermaid_config.htmlLabels

```javascript
mermaid_config.startOnLoad = true;
```

> **Warning** 这个方式已经被废弃，请使用上述推荐的方式传入参数初始化。目前这块的接口只是为了兼容老版本的方案。
