const markdownRenderer = require('marked')

markdownRenderer.setOptions({
  renderer: new markdownRenderer.Renderer(),
  gfm: true,
  smartLists: true,
});

const renderer = {
    code(code, info, escaped) {
        let cellAttr = info.split(" ");
        return `<MarkdownCell userid={\"{userId}\"} shouldRun={shouldRunCells} theme={theme} keymap={keymap} lang={\"${cellAttr[0]}\"} iname={\"${cellAttr[1]}\"} code={\`${code}\`}/>`
    }
};

markdownRenderer.use({ renderer });

module.exports.marked = markdownRenderer;
