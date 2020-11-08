const markdownRenderer = require('marked')

markdownRenderer.setOptions({
  renderer: new markdownRenderer.Renderer(),
  gfm: true,
  smartLists: true,
});

const renderer = {
    code(code, info, escaped) {
        var divStyle = 'style="width:100%; height:auto; border: solid 1px #DFDFDF; background: #F7F7F7; padding:0.5%"';
        var buttonStyle = 'style="font-size: 12px; float: right; border: solid 1px black; margin-top: 1%"';
        
        return (
            `HELLO FROM OUR SHARED RENDERER
			<code>
            	<pre>
            		<div ${divStyle}>${code}</div>
            		<button ${buttonStyle}>Run Code Cell</button>
            	</pre>
            	</code>`
        )
    }
};

markdownRenderer.use({ renderer });

module.exports.marked = markdownRenderer;
