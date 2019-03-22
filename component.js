function drawComponent(name, parentElement, innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy) {
    var self = {name, parentElement}
    var children = []

    self.element = null
    self.children = children

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

            if(key == 'name')
                return name

            if(key == 'self')
                return self

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
                    innerComponentDescription[3] = child
                //    self[referenceName] = child
            }
            else {
                var child = drawComponent('inner-content', self.element || parentElement, contentComponents, [], [], function(){}, function(){}, function(){}, function(){}) //component(self.element || parentElement, contentComponents)
                children.push(child)

                if(referenceName)
                    innerComponentDescription[3] = child
                //    self[referenceName] = child
            }

            function updateNamespace(components) {
                components.forEach(componentDescription => {
                    var referenceName
                    var component
                    var contentComponents

                    referenceName = componentDescription[0]

                    if(typeof referenceName == 'string') {
                        component = componentDescription[1]
                        contentComponents = componentDescription[2]
                    }
                    else {
                        component = componentDescription[0]
                        contentComponents = componentDescription[1]
                        referenceName = undefined
                    }

                    if(referenceName)
                        self[referenceName] = componentDescription[3]

                    if(contentComponents)
                        updateNamespace(contentComponents)
                })
            }

            updateNamespace(innerComponents)
        })
    }

    onInit.call(self)

    return proxy
}

function destroyComponentView(componentView) {
    componentView.children.forEach(child => destroyComponentView(child))
    componentView.destroy()
}

function AnonimComponent(name, innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy) {
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
        //if(contentComponents) {
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
        //}

        return drawComponent(name, parentElement, innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy)
    }
}

var components = []

function Component(name, innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy) {
    var component = AnonimComponent(name, innerComponents, inputs, outputs, constructor, onInit, onChange, onDestroy)
    components.push(component)
    return component
}

///////////////////////////////////////////////////////////////////////////

/*
var TextComponent = Component(
    'text',
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
    'button',
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
    'text-template',
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
    'div',
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

var EmptyComponent = Component(
    'empty',
    null,

    [],
    [],

    function() {

    },

    function() {

    },

    function() {

    },

    function() {

    }
)

var RectangleComponent = Component(
    'rectangle',
    [
        //['wrapper', DivComponent, 'inner-content']
        ['wrapper', null, 'inner-content']
    ],

    ['1'],
    [],

    function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    function() {
        //console.log(this.parentElement, this.children[0].element)

        //console.log(this.parentElement)
        this.element.style.display = 'block'
        this.element.style.padding = '10px'
        this.element.style.backgroundColor = 'red'
    },

    function(name, newValue, oldValue) {

    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

//var rectangle = RectangleComponent(document.body, [[ButtonComponent]])

var TempComponent = Component(
    'temp',
    [
        [RectangleComponent, [
            ['asdf', TextComponent],
            [ButtonComponent]
        ]]
    ],

    [],
    [],

    function() {

    },

    function() {
        this.asdf.value = 'Hidkfjs'
    },

    function(name, newValue, oldValue) {

    },

    function() {

    }
)

var t = TempComponent(document.body)
//destroyComponentView(t)
*/