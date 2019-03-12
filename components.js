var TextComponent = Component(
    [
        ['text']
    ],

    ['value'],
    [],

    function(value) {
        this.values[0] = 'text'
    },

    function(value) {
        this.view[0].element.data = value
    }
)

var ButtonComponent = Component(
    [
        ['button', [
            [TextComponent]
        ]]
    ],

    ['text'],
    ['click'],

    function(text, click) {
        this.view[0][0].value = this.values[0] = 'Button'

        this.view[0].element.onclick = function() {
            click()
        }
    },

    function(text, click) {
        this.view[0][0].value = text
    }
)

var InputComponent = Component(
    [
        ['input']
    ],

    ['value'],
    ['valueChange'],

    function(value, valueChange) {
        var inputElement = this.view[0].element

        inputElement.oninput = function() {
            valueChange(inputElement.value)
        }
    },

    function(value, valueChange) {
        this.view[0].element.value = value
    }
)

var SelectComponent = Component(
    [
        ['select']
    ],

    ['items', 'selectedItemIndex'],
    ['selectedItemIndexChanged'],

    function(items, selectedItemIndex, selectedItemIndexChanged) {
        var selectElement = this.view[0].element

        selectElement.oninput = function(event) {
            var selectedIndex = event.target.selectedIndex
            selectedItemIndexChanged(selectedIndex)
        }
    },

    function(items, selectedItemIndex, selectedItemIndexChanged) {
        var select = this.view[0]
        var selectElement = select.element

        if(this.changedInput == 0) {
            selectElement.innerHTML = ''

            items.forEach(function(item) {
                var optionElement = document.createElement('option')
                optionElement.innerHTML = item
                selectElement.appendChild(optionElement)
            })
        }
        else if(this.changedInput == 1) {
            selectElement.selectedIndex = selectedItemIndex
        }
    }
)

var NameEditorComponent = Component(
    [
        ['input']
    ],

    ['value'],
    ['valueChange'],

    function(value, valueChange) {
        var inputElement = this.view[0].element
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
            valueChange(inputElement.value)
        }

        inputElement.onclick = function(event) {
            event.stopPropagation()
        }
    },

    function(value, valueChange) {
        var inputElement = this.view[0].element
        var style = inputElement.style
        style.width = Math.max(20, getTextWidth(value)) + 'px'
        inputElement.value = value
    }    
)

var GridComponent = Component(
    [
        ['div', 'inner-content']
    ],

    ['rows', 'columns', 'gap', 'height'],
    [],

    function(rows, columns, gap) {
        var element = this.view[0].element
        var style = element.style

        style.display = 'grid'
    },

    function(rows, columns, gap, height) {
        var element = this.view[0].element
        var style = element.style

        if(this.changedInput == 0)
            style.gridTemplateRows = rows
        else if(this.changedInput == 1)
            style.gridTemplateColumns = columns
        else if(this.changedInput == 2)
            style.gap = gap
        else if(this.changedInput == 3)
            style.height = height
    }
)

var ScrollComponent = Component(
    [
        ['div', 'inner-content']
    ],

    ['height'],
    [],

    function(rows, columns, gap) {
        var element = this.view[0].element
        var style = element.style

        style.display = 'block'
        style.overflow = 'auto'
    },

    function(height) {
        var element = this.view[0].element
        var style = element.style

        style.height = height
    }
)

var RectangleComponent = Component(
    [
        ['div', 'inner-content']
    ],

    ['width', 'height', 'margin', 'padding'],
    [],

    function(width, height, margin, padding) {
        var element = this.view[0].element
        var style = element.style

        style.display = 'inline-block'
        style.overflow = 'auto'
    },

    function(width, height, margin, padding) {
        var element = this.view[0].element
        var style = element.style

        if(this.changedInput == 0)
            style.width = width
        else if(this.changedInput == 1)
            style.height = height
        else if(this.changedInput == 2)
            style.margin = margin
        else if(this.changedInput == 3)
            style.padding = padding
    }
)

var ListComponent = Component(
    [],

    ['template', 'items'],
    ['itemChange'],

    function(template, items, itemChange) {
        this.views = []
    },

    function(template, items, itemChange) {
        if(this.changedInput == 0) {
            this.template = template
        }
        else if(this.changedInput == 1) {
            var parent = this.parent
            var templateComponent = this.template

            this.views.forEach(function(view) {
                deleteView(view)
            })

            this.views.splice(this.views.length, 0)

            var views = this.views

            items.forEach(function(item, index){
                var component = templateComponent(parent)
                component.value = item

                component.valueChange = function(data) {
                    itemChange({
                        data: data,
                        index: index
                    })
                }

                views[index] = component
            })
        }
    }
)