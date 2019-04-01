var JavaScriptMode = ace.require('ace/mode/javascript').Mode
var snippet = ace.require('ace/snippets/javascript').snippetText

var CodeEditor = AnonimComponent({
    name: 'CodeEditor',

    structure: [
        ['wrapper', Rectangle]
    ],

    inputs: ['value'],
    outputs: ['valueChange'],

    init: function() {
        this.wrapper.width = '100%'
        //this.wrapper.height = '1000px'

        this.editor = ace.edit(this.wrapper.element)
        this.editor.setTheme('ace/theme/monokai')
        this.editor.session.setMode(new JavaScriptMode())

        this.editor.on('change', () => {
            this.valueChange(this.editor.getValue())
        })

        //ace.config.loadModule('ace/ext/language_tools', t => {
        //    console.log(t.addCompleter(this.editor), this.editor.insertSnippet)
        //    this.editor.insertSnippet(snippetText)
        //})
    },

    change: {
        value: function(value) {
            this.editor.setValue(value)
        }
    },

    destroy: function() {
        this.editor.destroy()
        this.editor.container.remove()
    }
})