function drawComponent(parentElement, innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy) {
    var self = {parentElement}
    var children = []

    self.element = null

    var outputListeners = outputs.map(() => undefined)

    var inputToIndexMap = {}

    inputs.reduce((map, name, index) => {
        self[name] = undefined
        map[name] = index
        return map
    }, inputToIndexMap)

    var outputToIndexMap = {}

    outputs.reduce((map, name, index) => {
        self[name] = function(data) {
            var listener = outputListeners[index]

            if(listener)
                listener(data)
        }

        map[name] = index
        return map
    }, outputToIndexMap)

    //TODO: __defineSetter__, __defineGetter__
    var proxy = new Proxy(self, {
        get: function(object, key) {
            if(key == 'children')
                return children

            if(key == 'destroy')
                return function() {
                    onDestroy.call(self)
                }

            if(key == 'parentElement')
                return parentElement

            if(key == 'element')
                return self.element

            if(key == 'inputs')
                return inputs

            if(key == 'outputs')
                return outputs

            var inputIndex = inputToIndexMap[key]

            if(typeof inputIndex == 'number')
                return self[key]

            if(typeof outputToIndexMap[key] == 'number')
                return self[key]
        },

        set: function(object, key, value) {
            if(typeof inputToIndexMap[key] == 'number') {
                var oldValue = self[key]
                self[key] = value
                onChange.call(self, key, value, oldValue)
                return
            }

            var outputIndex = outputToIndexMap[key]

            if(typeof outputIndex == 'number') {
                outputListeners[outputIndex] = value
                return
            }
        }
    })

    constructor.call(self)

    if(innerComponents) {
        innerComponents.forEach(innerComponentDescription => {
            var referenceName
            var component
            var contentComponents

            referenceName = innerComponentDescription[0]

            if(typeof referenceName == 'string') {
                component = innerComponentDescription[1]
                contentComponents = innerComponentDescription[2]
            }
            else {
                component = innerComponentDescription[0]
                contentComponents = innerComponentDescription[1]
                referenceName = undefined
            }

            if(component) {
                var child = component(self.element || parentElement, contentComponents)
                children.push(child)

                if(referenceName)
                    self[referenceName] = child
            }
        })
    }

    onInit.call(self)

    return proxy
}

function destroyComponentView(componentView) {
    componentView.children.forEach(child => destroyComponentView(child))
    componentView.destroy()
}

function Component(innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy) {
    var innerContentIndieces = []

    function getInnerContentIndex(nodes, innerContentPath) {
        nodes.forEach(function(node, index) {
            var isNamed = typeof node[0] == 'string'
            var innerContentShift = isNamed
                ? 2
                : 1

            if(node[innerContentShift] === 'inner-content')
                innerContentIndieces.push(innerContentPath.concat([index]))
            else if(Array.isArray(node[innerContentShift])) {
                innerContentPath.push(index)
                getInnerContentIndex(node[innerContentShift], innerContentPath)
                innerContentPath.pop()
            }
        })
    }

    if(innerComponents)
        getInnerContentIndex(innerComponents, innerContentIndieces)

    return function(parentElement, contentComponents) {
        if(contentComponents) {
            innerContentIndieces.forEach(function(index){
                var innerIndexNode = innerComponents

                for(var i = 0; i < index.length; ++i)
                    innerIndexNode = innerIndexNode[index[i]]

                var isNamed = typeof innerIndexNode[0] == 'string'
                var innerContentShift = isNamed
                    ? 2
                    : 1

                innerIndexNode[innerContentShift] = contentComponents
            })
        }

        return drawComponent(parentElement, innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy)
    }
}

///////////////////////////////////////////////////////////////////////////

var TextComponent = Component(
    null,
    
    ['value'],
    [],

    function() {
        this.element = document.createTextNode('text')
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

var text = TextComponent(document.body)
text.value = 'Hi'

var ButtonComponent = Component(
    [
        ['text', TextComponent]
    ],

    ['text'],
    ['click'],

    function() {
        this.element = document.createElement('button')
    },

    function() {
        this.text.value = 'Button'

        var self = this
        this.element.onclick = function() {
            self.click()
        }

        this.parentElement.appendChild(this.element)
    },

    function(name, newValue, oldValue) {
        this.text = newValue
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var button = ButtonComponent(document.body)

button.click = function() {
    console.log('Hi')
}

var ListComponent = Component(
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
                this.views.forEach(view => deleteView(view))
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
        this.views.forEach(view => deleteView(view))
    }
)

var list = ListComponent(document.body)

list.template = Component(
    [
        ['text', TextComponent]
    ],

    ['value'],
    ['valueChange'],

    function() {

    },

    function() {

    },

    function(name, value) {
        this.text.value = value
    },

    function() {

    }
)

list.items = [1, 2, 8]

var DivComponent = Component(
    null,

    [],
    [],

    function() {
        this.element = document.createElement('div')
    },

    function() {
        this.parentElement.appendChild(this.element)
    },

    function(name, newValue, oldValue) {

    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var RectangleComponent = Component(
    [
        ['wrapper', DivComponent, 'inner-content']
    ],

    [],
    [],

    function() {

    },

    function() {
        this.wrapper.element.style.display = 'block'
        this.wrapper.element.style.padding = '10px'
        this.wrapper.element.style.backgroundColor = 'red'
    },

    function(name, newValue, oldValue) {

    },

    function() {

    }
)

//var rectangle = RectangleComponent(document.body, [[ButtonComponent]])

var TempComponent = Component(
    [
        [RectangleComponent, [
            [TextComponent]
        ]]
    ],

    [],
    [],

    function() {

    },

    function() {

    },

    function(name, newValue, oldValue) {

    },

    function() {

    }
)

var t = TempComponent(document.body)