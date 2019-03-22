var TextComponent = Component(
    'text',
    null,
    
    ['value'],
    [],

    function() {
        this.element = document.createTextNode('')
    },

    function() {
        this.parentElement.appendChild(this.element)
    },

    function(name, newValue, oldValue) {
        this.element.data = newValue
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var ButtonComponent = Component(
    'button',
    [
        ['textOnButton', TextComponent]
    ],

    ['text'],
    ['click'],

    function() {
        this.element = document.createElement('button')
    },

    function() {
        this.text = this.textOnButton.value = 'Button'

        var self = this
        this.element.onclick = function() {
            self.click()
        }

        this.parentElement.appendChild(this.element)
    },

    function(name, newValue, oldValue) {
        this.textOnButton.value = newValue
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var InputComponent = Component(
    'input',
    null,
    
    ['value'],
    ['valueChange'],

    function() {
        this.element = document.createElement('input')
        this.parentElement.appendChild(this.element)
    },

    function() {
        var self = this
        this.element.oninput = function(event) {
            self.valueChange(self.element.value)
        }
    },

    function(name, value, oldValue) {
        this.element.value = value
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var SelectComponent = Component(
    'dropdown',
    null,

    ['items', 'selectedItemIndex'],
    ['selectedItemIndexChanged'],

    function() {
        this.element = document.createElement('select')
    },

    function() {
        this.element.oninput = function(event) {
            var selectedIndex = event.target.selectedIndex
            this.selectedItemIndexChanged(selectedIndex)
        }
    },

    function() {
        if(name == 'items') {
            this.element.innerHTML = ''

            this.items.forEach(function(item) {
                var optionElement = document.createElement('option')
                optionElement.innerHTML = item
                this.element.appendChild(optionElement)
            })
        }
        else if(name == 'selectedItemIndex') {
            this.element.selectedIndex = this.selectedItemIndex
        }
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var NameEditorComponent = Component(
    'name-editor',
    null,

    ['value'],
    ['valueChange'],

    function() {
        this.element = document.createElement('input')
    },

    function() {
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

    function(name, value) {
        var inputElement = this.element
        var style = inputElement.style
        style.width = Math.max(20, getTextWidth(value)) + 'px'
        inputElement.value = value
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var GridComponent = Component(
    'grid',
    [
        [null, 'inner-content']
    ],

    ['rows', 'columns', 'gap', 'height'],
    [],

    function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    function() {
        with(this.element.style) {
            display = 'grid'
            height = '100%'
        }
    },

    function(name, value, oldValue) {
        var style = this.element.style

        switch(name) {
            case 'rows':
                style.gridTemplateRows = value
                break

            case 'columns':
                style.gridTemplateColumns = value
                break

            case 'gap':
                style.gap = value
                break

            case 'height':
                style.height = value
                break
        }
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var ScrollComponent = Component(
    'scroll',
    [
        [null, 'inner-content']
    ],

    [],
    [],

    function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    function() {
        var style = this.element.style

        style.display = 'block'
        style.overflow = 'auto'
    },

    function(name, newValue, oldValue) {
        
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var RectangleComponent = Component(
    'rectangle',
    [
        [null, 'inner-content']
    ],

    ['width', 'height', 'margin', 'padding'],
    [],

    function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    function() {
        this.element.style.display = 'inline-block'
    },

    function(name, value, oldValue) {
        var style = this.element.style
        style[name] = value
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var ListComponent = Component(
    'list',
    null,

    ['template', 'items'],
    ['itemChange'],

    function() {
        this.views = []
    },

    function() {

    },

    function(name, value) {
        var self = this

        switch(name) {
            case 'items':
                this.views.forEach(view => destroyComponentView(view))
                this.views.splice(this.views.length, 0)

                this.items.forEach(function(item, index){
                    var component = self.template(self.parentElement)
                    component.value = item

                    component.valueChange = function(data) {
                        self.itemChange({data, index})
                    }

                    self.views[index] = component
                })
                break
        }
    },

    function() {
        this.views.forEach(view => destroyComponentView(view))
    }
)

var TabPanel = Component(
    'tab-panel',

    [
        ['wrapper', GridComponent, [
            ['head', RectangleComponent, [
                ['headList', ListComponent]
            ]],
            ['page', RectangleComponent, [

            ]]
        ]]
    ],

    ['tabNames', 'pages'],
    [],

    function() {

    },

    function() {
        var tabPanel = this
        this.wrapper.rows = 'min-content auto'

        this.headList.template = AnonimComponent(
            'tab-panel-head',

            [
                [RectangleComponent, [
                        ['navigationButton', ButtonComponent]
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
        }
    },

    function(name, value) {
        switch(name) {
            case 'tabNames':
                this.headList.items = value
                break
        }
    },

    function() {

    }
)

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