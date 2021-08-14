# Development


## Updating the documentation

We write documention with GitBook.

Please continue with the [mermaid-gitbook](https://github.com/mermaidjs/mermaid-gitbook) project.


## How to add a new diagram type


### Step 1: Grammar & Parsing


#### Grammar

This would be to define a jison grammar for the new diagram type. That should start with a way to identify that the text in the mermaid tag is a diagram of that type. Create a new folder under diagrams for your new diagram type and a parser folder in it. This leads us to step 2.

For instance:

* the flowchart starts with the keyword graph.
* the sequence diagram starts with the keyword sequenceDiagram

### Generate the Parser object
To generate the Parser object for your [jison](http://zaa.ch/jison/) grammar file execute the following command:

```
yarn jison
```

> Note: On Windows you may need to change the Gulp configuration. If you're getting errors, try replacing the jison script in your package.json file:
> ```json
> "jison": "node -r babel-register node_modules/gulp/bin/gulp.js jison",
> ```

Once the command finishes, you should see a new .js file in your diagram type folder.

#### Store data found during parsing

There are some jison specific sub steps here where the parser stores the data encountered when parsing the diagram, this data is later used by the renderer. You can during the parsing call a object provided to the parser by the user of the parser. This object can be called during parsing for storing data.

```
statement
	: 'participant' actor  { $$='actor'; }
	| signal               { $$='signal'; }
	| note_statement       { $$='note';  }
	| 'title' message      { yy.setTitle($2);  }
	;
```

In the extract of the grammar above, it is defined that a call to the setTitle method in the data object will be done when parsing and the title keyword is encountered.

> **Info** Make sure that the `parseError` function for the parser is defined and calling `mermaidPAI.parseError`. This way a common way of detecting parse errors is provided for the end-user.

For more info look in the example diagram type:

The `yy` object has the following function:

```javascript
exports.parseError = function(err, hash){
   mermaidAPI.parseError(err, hash)
};
```

when parsing the `yy` object is initialized as per below:

```javascript
var parser
parser = exampleParser.parser
parser.yy = db
```

### Step 2: Rendering

Write a renderer that given the data found during parsing renders the diagram. To look at an example look at sequendeRenderer.js rather then the flowchart renderer as this is a more generic example.

Place the renderer in the diagram folder.


### Step 3: Detection of the new diagram type

The second thing to do is to add the capability to detect the new new diagram to type to the detectType in utils.js. The detection should return a key for the new diagram type.


### Step 4: The final piece - triggering the rendering

At this point when mermaid is trying to render the diagram, it will detect it as being of the new type but there will be no match when trying to render the diagram. To fix this update the mermaidAPI.js file with the following changes:
1. Add a reference to your own Renderer, Parser and DB. For example, if your new diagram type is ``chen`` you will get something like:  
   ```javascript
   import chenRenderer from './diagrams/chen/chenRenderer'
   import chenParser from './diagrams/chen/parser/chen'
   import chenDb from './diagrams/chen/chenDb'
   ```
1. Update the configuration for your diagram type, by adding a new property to the ``config`` object. For example:
   ```javascript
   /**
    * ### Chen
    * *The object containing configurations specific for Chen's ERD*
    */
   chen: {
     /**
      * **htmlLabels** - Flag for setting whether or not a html tag should be used for rendering labels
      * on the edges
      */
     htmlLabels: true,
 
     curve: 'linear'
   },
   ```
1. Add a new ``case`` in the ``switch`` statement in the ``parse`` method. This should match the diagram type returned from step #2. The code in this new case statement should configure the parser for the diagram type. For example:
   ```javascript
   case 'chen':
     parser = chenParser
     parser.parser.yy = chenDb
     break
   ```
1. Add a new ``case`` in the ``switch`` statement in the ``render`` method. This should match the diagram type returned from step #2. The code in this new case statement should call the renderer for the diagram type with the data found by the parser as an argument. For example:
   ```javascript
   case 'chen':
     config.chen.arrowMarkerAbsolute = config.arrowMarkerAbsolute
     chenRenderer.setConf(config.chen)
     chenRenderer.draw(txt, id, false)
     break
   ```

## Usage of the parser as a separate module


### Setup

```javascript
var graph = require('./graphDb')
var flow = require('./parser/flow')
flow.parser.yy = graph
```


### Parsing

```javascript
flow.parser.parse(text)
```


### Data extraction

```javascript
graph.getDirection()
graph.getVertices()
graph.getEdges()
```

The parser is also exposed in the mermaid api by calling:

```javascript
var parser = mermaid.getParser()
```

Note that the parse needs a graph object to store the data as per:

```javascript
flow.parser.yy = graph
```

Look at `graphDb.js` for more details on that object.
