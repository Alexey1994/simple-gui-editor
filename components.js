var Text = Component({
    name: 'text',
    
    inputs: ['value', 'style'],

    create: function() {
        this.element = document.createElement('span')
        this.textNode = document.createTextNode('')
        this.element.appendChild(this.textNode)

        this.style = 'normal' //normal, italic, oblique
    },

    init: function() {
        this.parentElement.appendChild(this.element)
    },

    change: {
        value: function(value) {
            this.textNode.data = value
        },

        style: function(style) {
            this.element.style.fontStyle = style
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})

var Button = Component({
    name: 'button',

    structure: [
        ['textOnButton', Text]
    ],

    inputs: ['text'],
    outputs: ['click'],

    create: function() {
        this.element = document.createElement('button')
    },

    init: function() {
        this.text = this.textOnButton.value = 'Button'

        var self = this
        this.element.onclick = function() {
            self.click()
        }

        this.parentElement.appendChild(this.element)
    },

    change: {
        value: function(value) {
            this.textOnButton.value = value
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})

var Input = Component({
    name: 'input',
    
    inputs: ['value'],
    outputs: ['valueChange'],

    create: function() {
        this.element = document.createElement('input')
        this.parentElement.appendChild(this.element)
    },

    init: function() {
        var self = this
        this.element.oninput = function(event) {
            self.valueChange(self.element.value)
        }
    },

    change: {
        value: function(value) {
            this.element.value = value
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})

var Select = Component({
    name: 'dropdown',

    inputs: ['items', 'selectedItemIndex'],
    outputs: ['selectedItemIndexChanged'],

    create: function() {
        this.element = document.createElement('select')
    },

    init: function() {
        this.element.oninput = function(event) {
            var selectedIndex = event.target.selectedIndex
            this.selectedItemIndexChanged(selectedIndex)
        }
    },

    change: {
        items: function(items) {
            this.element.innerHTML = ''

            items.forEach(function(item) {
                var optionElement = document.createElement('option')
                optionElement.innerHTML = item
                this.element.appendChild(optionElement)
            })
        },

        selectedItemIndex: function(selectedItemIndex) {
            this.element.selectedIndex = selectedItemIndex
        }
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
})

var NameEditor = Component({
    name: 'name-editor',

    inputs: ['value'],
    outputs: ['valueChange'],

    create: function() {
        this.element = document.createElement('input')
    },

    init: function() {
        var inputElement = this.element
        var style = inputElement.style

        style.pointer         = 'text'
        style.backgroundColor = 'transparent'
        style.border          = 'none'
        style.padding         = 0
        style.margin          = 0
        style.outline         = 'none'
        style.width           = '20px'
        style.height          = '20px'

        inputElement.oninput = function() {
            style.width = Math.max(20, getTextWidth(inputElement.value)) + 'px'
            this.valueChange(inputElement.value)
        }

        inputElement.onclick = function(event) {
            event.stopPropagation()
        }
    },

    change: {
        value: function(value) {
            var inputElement = this.element
            var style = inputElement.style
            style.width = Math.max(20, getTextWidth(value)) + 'px'
            inputElement.value = value
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})

var Grid = Component({
    name: 'grid',

    structure: [
        [null, 'inner-content']
    ],

    inputs: ['rows', 'columns', 'gap', 'height'],

    create: function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    init: function() {
        with(this.element.style) {
            display = 'grid'
            height = '100%'
        }
    },

    change: {
        rows:    function(rows)    { this.element.style.gridTemplateRows = rows },
        columns: function(columns) { this.element.style.gridTemplateColumns = columns },
        gap:     function(gap)     { this.element.style.gap = gap },
        rows:    function(rows)    { this.element.style.gridTemplateRows = rows },
        rows:    function(rows)    { this.element.style.gridTemplateRows = rows }
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
})

var Scroll = Component({
    name: 'scroll',

    structure: [
        [null, 'inner-content']
    ],

    create: function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    init: function() {
        var style = this.element.style

        style.display = 'block'
        style.overflow = 'auto'
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})

var Rectangle = Component({
    name: 'rectangle',

    structure: [
        [null, 'inner-content']
    ],

    inputs: ['width', 'height', 'margin', 'padding', 'color'],

    create: function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    init: function() {
        this.element.style.display = 'inline-block'
    },

    change: {
        width:   function(width)   {this.element.style.width = width},
        height:  function(height)  {this.element.style.height = height},
        margin:  function(margin)  {this.element.style.margin = margin},
        padding: function(padding) {this.element.style.padding = padding},
        color:   function(color)   {this.element.style.backgroundColor = color}
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})

var List = Component({
    name: 'list',

    inputs: ['template', 'items'],
    outputs: ['itemChange'],

    create: function() {
        this.views = []
    },

    change: {
        items: function(items) {
            var self = this

            this.views.forEach(view => destroyComponentView(view))
            this.views.splice(this.views.length, 0)

            this.items.forEach((item, index) => {
                var component = this.template(this.parentElement)
                component.value = item

                component.valueChange = function(data) {
                    self.itemChange({data, index})
                }

                this.views[index] = component
            })
        }
    },

    destroy: function() {
        this.views.forEach(view => destroyComponentView(view))
    }
})

var TabPanel = Component({
    name: 'tab-panel',

    structure: [
        ['wrapper', Grid, [
            ['head', Rectangle, [
                ['headList', List]
            ]],
            ['page', Rectangle]
        ]]
    ],

    inputs: ['tabNames', 'pages'],
    outputs: ['tabChanged'],

    init: function() {
        var tabPanel = this
        this.wrapper.rows = 'min-content auto'

        this.headList.template = AnonimComponent(
            'tab-panel-head',

            [
                [Rectangle, [
                        ['navigationButton', Button]
                ]]
            ],

            ['value'],
            ['valueChange'],

            function() {

            },

            function() {

            },

            function(name, value) {
                var self = this
                this.navigationButton.text = value

                this.navigationButton.click = function() {
                    self.valueChange(self.value)
                }
            },

            function() {

            }
        )

        this.headList.itemChange = function(selectedTab) {
            if(tabPanel.selectedTab)
                destroyComponentView(tabPanel.selectedTab)

            tabPanel.selectedTab = tabPanel.pages[selectedTab.index](tabPanel.page.element)
            tabPanel.tabChanged({tab: tabPanel.selectedTab, name: selectedTab.data})
        }
    },

    change: {
        tabNames: function(tabNames) {
            this.headList.items = tabNames
        }
    }
})
/*
var page1 = AnonimComponent(
    'page1',
    [
        ['text', TextComponent]
    ],

    [], [],

    function() {

    },

    function() {
        this.text.value = 'Page 1'
    },

    function(name, value) {

    },

    function() {

    }
)

var page2 = AnonimComponent(
    'page2',
    [
        ['text', TextComponent],
        [ButtonComponent]
    ],

    [], [],

    function() {

    },

    function() {
        this.text.value = 'Page 2'
    },

    function(name, value) {

    },

    function() {

    }
)

var tab = TabPanel(document.body)
tab.pages = [page1, page2]
tab.tabNames = ['Tab1', 'Tab2']
*/