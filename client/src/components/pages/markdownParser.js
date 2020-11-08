const markdownRenderer = require('marked')

markdownRenderer.setOptions({
  renderer: new markdownRenderer.Renderer(),
  gfm: true,
  smartLists: true,
});

const renderer = {
    code(code, info, escaped) {
        //var divStyle = 'style={{width:100%; height:auto; border: solid 1px #DFDFDF; background: #F7F7F7; padding:0.5%}}';
        //var buttonStyle = 'style={{font-size: 12px; float: right; border: solid 1px black; margin-top: 1%}}';
        /*
        return (
            `<code>
            	<pre>
            		<div >${code}</div>
            		<button onClick={sendMe}>{foo}</button>
            	</pre>
            	</code>`
        )
        */
        let cellAttr = info.split(" ");
        let codeFragment = `<React.Fragment>${code}</React.Fragment>`
        return `<MarkdownCell userid={\"{userId}\"}lang={\"${cellAttr[0]}\"} iname={\"${cellAttr[1]}\"} code={\`${code}\`}/>`
    }
};

markdownRenderer.use({ renderer });

module.exports.marked = markdownRenderer;
