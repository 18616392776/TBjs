TBjs开发文档
========================
关于我：
------------------------
QQ：464328895 
由于本人能力有限，且读书少，英语更是烂上加烂，所以希望有兴趣的童鞋一起参于开发

项目简介：
------------------------
由于在实际开发过程中，因为前后台的一些差异，往往同样的逻辑需要实现两遍，且不能做到模板通用，所以爱折腾的我发起这个项目  

#### 当前前端框架及类库的一些限制（见识所限，难免谬误）：
##### React  
本身并没有做什么事，只是提供一了套前端组织代码的方法，JSX虽好，但需要编译，否则前端需要加载JSX的解析文件，不利于前端精简代码……  
##### Angular
angular各种好，但2.0跳崖式升级，想必大家的有所诟病，另外不利于SEO，虽然有其他迂回的方法，但还是让人不爽，模板和指令很好，但后台不认识，兼容第三方类库或插件也必须经过包装…… 
##### jQuery
这个基本不用说了，大家太熟悉，jQuery提供了一套非常优雅的API，操作DOM非常方便，但基本可能说，也仅些而已。 


其它不说了，大家比我懂得多得多，在此向那些编写框架，为我们这些后辈提供解决方案和思路的前辈致敬。  
TBjs发起的初衷是想成为一个具有模块化、MVC、AMD异步加载、整合第三方代码容易，当然，最重要的是能前后台通用代码。


#### 当前目录简介及开发进度（可能因为不能及时更新，有所不同）：
请无视requirejs  

* `classes`		源码目录
	- `TBjs.js`		框架主文件
	- `src`			框架源文件
		*	`amd.js`			类requriejs
		*	`ast.js`			摘自angular
		*	`compiler.js`		未完成
		*	`http.js`			开发中……
		*	`lexer.js`			摘自angular
		*	`module.js`			开发中……
		*	`promise.js`		摘自互联网
		*	`query.js`			类jQuery，兼容虚拟dom
		*	`toolkit.js`		常用js方法的集合
		*	`xmlEngine.js`		虚拟dom
* `test.html`	测试文件



基本成型模块简介：
-----------------------------------

#### xmlEngine 

主要实现把一个html字符串解析成一个类dom树，并附带常用方法，能让后台调用dom的标准方法，方法列表如下：
- 根节点
	* 属性
		- `$XMLContent` 构建dom树传入的字符串
		- `$childNodes` 私有属性
		- `$ENGINE` 私有属性
		- `nodeType`
		- `parentNode`
		- `innerHTML`
		- `innerText`
		- `outerHtml`
		- `classList`
		- `className`
		- `childNodes`
		- `children`
		- `eventListener`
	* 方法
		- `$XMLBuilder`私有方法
		- `$XMLEngine`私有方法
		- `$refresh`私有方法
		- `createComment`
		- `createElement`
		- `createTextNode`
		- `getElementById`
		- `getElementsByName`
		- `appendChild`
		- `getElementsByClassName`
		- `getElementsByTagName`
		- `insertBefore`
		- `removeChild`
		- `getAttribute`
		- `hasAttribute`
		- `removeAttribute`
		- `setAttribute`
		- `querySelector`
		- `querySelectorAll`
		- `setInnerHtml`
		- `addEventListener`
		- `removeEventListener`
		- `getInnerHtml`
		- `getInnerText`
		- `getOuterHtml`
- 双标签节点
	* 属性
		- `$childNodes`私有属性
		- `$ENGINE`私有属性
		- `tagName`
		- `nodeName`
		- `parentNode`
		- `innerHTML`
		- `id`
		- `innerText`
		- `outerHtml`
		- `classList`
		- `className`
		- `attributes`
		- `eventListener`
	* 方法
		- `$refresh`私有方法
		- `appendChild`
		- `getElementsByClassName`
		- `getElementsByTagName`
		- `insertBefore`
		- `removeChild`
		- `getAttribute`
		- `hasAttribute`
		- `setAttribute`
		- `removeAttribute`
		- `querySelector`
		- `querySelectorAll`
		- `setInnerHtml`
		- `addEventListener`
		- `removeEventListener`
		- `getInnerHtml`
		- `getInnerText`
		- `getOuterHtml`
- 单标签节点
	* 属性
		- `$ENGINE`私有属性
		- `tagName`
		- `nodeName`
		- `nodeType`
		- `parentNode`
		- `innerHTML`
		- `innerText`
		- `outerHtml`
		- `id`
		- `classList`
		- `className`
		- `attributes`
		- `eventListener`
	* 方法
		- `$refresh`私有方法
		- `getAttribute`
		- `setAttribute`
		- `removeAttribute`
		- `hasAttribute`
		- `querySelector`
		- `querySelectorAll`
		- `setInnerHtml`
		- `addEventListener`
		- `removeEventListener`
		- `getInnerHtml`
		- `getInnerText`
		- `getOuterHtml`
- 文本节点
	* 属性
		- `$ENGINE`私有属性
		- `parentNode`
		- `nodeType`
		- `innerHTML`
		- `innerText`
		- `outerHtml`
		- `eventListener`
	* 方法
		- `$refresh`私有方法
		- `addEventListener`
		- `removeEventListener`
		- `getInnerHtml`
		- `getInnerText`
		- `getOuterHtml`
- 注释节点
	* 属性
		- `$ENGINE`私有属性
		- `parentNode`
		- `nodeType`
		- `innerHTML`
		- `innerText`
		- `outerHtml`
	* 方法
		- `getInnerHtml`
		- `getInnerText`
		- `getOuterHtml`
			
##### 使用说明：
所有的属性都是只读的，要更改属性需调用相对应的方法，更快捷的操作是通过`query`模块来包装，就可以像jQuery一样来操作虚拟dom，demo如下：
```javascript
// 虚拟dom使用示例
var $ = require('query');
var XMLEngine = require('xmlEngine');
var document = new XMLEngine('htmlText');
var box = document.getElementById('#box');
box.addEventListener('click', function(){
	this.setAttribute('className', 'container');
}, false);

//通过query模块包装后的示例
//注意此处，query模块如果直接传入选择器，会默认使用全局的document，也就是说，在浏览器端，也是可以像jQuery一样使用的
$('#box').on('click',function(){
	$(this).addClass('container');
})

//也可以这样

$(document).find('#box').on('click',function(){
	$(this).addClass('container');
})

```

#### query

一个类jQuery的库，使用方法和jQuery基本一致，主要实现兼容浏览器端的常用dom操作和虚拟dom的快捷操作，如选择器、事件绑定解绑和委托、属性操作等。
方法：
- `find`
- `on`
- `off`
- `one`
- `trigger`
- `addClass`
- `removeClass`
- `hasClass`
- `each`
- `attr`
- `html`


		
			