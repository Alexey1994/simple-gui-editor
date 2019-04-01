var structure = []
var selectedComponent

function componentViewHasInnerContent(componentView) {
    function nodeHasInnerContent(structureNode) {
        var name
        var component
        var innerContent

        if(typeof structureNode[0] == 'string') {
            name = structureNode[0]
            component = structureNode[1]
            innerContent = structureNode[2]
        }
        else {
            component = structureNode[0]
            innerContent = structureNode[1]
        }

        if(!component)
            return true
    }

    var structure = componentView.structure

    if(structure) 
        for(var structureNode of componentView.structure)
            if(nodeHasInnerContent(structureNode))
                return true

    return false
}

function addElementInPreview(parent, component) {
    var elementWrapper = {}
    var element

    var ElementPreview = AnonimComponent({
        name: 'ElementPreview',
        
        structure: [
            ['wrapper', Rectangle, [
                ['wrappedComponent', component, 'inner-content']
                //['wrappedComponent', component]
            ]]
        ],

        init: function() {
            elementWrapper.hasInnerContent = componentViewHasInnerContent(this.wrappedComponent)

            if(elementWrapper.hasInnerContent) {
                elementWrapper.structure = []

                this.wrapper.element.ondrop = event => {
                    event.stopPropagation()
                    console.log('drop inner content')

                    var elementType = event.dataTransfer.getData('data')
                    var elementIndex = parseInt(elementType)
                    var droppedComponent = components[elementIndex]

                    //addElementInPreview(this.element, droppedComponent)
                    //addElementInPreview(document.body, droppedComponent)

                    elementWrapper.structure.push([droppedComponent])

                    console.log(elementWrapper.structure)
                    destroyComponentView(element)
                    element = ElementPreview(parent, elementWrapper.structure)
                    //element = component(parent, elementWrapper.structure)
                    elementWrapper.element = element
                }
            }

            this.wrapper.element.onclick = () => {
                selectedComponent = element

                if(elementEditor)
                    elementEditor.element = element
            }

            this.wrapper.element.onmouseenter = () => {
                this.wrapper.element.style.outline = '1px solid #000'
            }

            this.wrapper.element.onmouseleave = () => {
                this.wrapper.element.style.outline = 'none'
            }
        }
    })

    element = ElementPreview(parent, ['yes'])
    selectedComponent = element

    if(elementEditor)
        elementEditor.element = element
    
    elementWrapper.element = element
    structure.push(elementWrapper)
}

var ComponentPreview = AnonimComponent({
    name: 'ComponentPreview',

    create: function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    init: function() {
        this.element.style.height = '100%'

        this.element.ondragenter = function(event) {
            event.returnValue = false
        }

        this.element.ondragover = function(event) {
            event.returnValue = false
        }

        this.element.ondrop = event => {
            var elementType = event.dataTransfer.getData('data')
            var elementIndex = parseInt(elementType)
            var droppedComponent = components[elementIndex]

            addElementInPreview(this.element, droppedComponent)
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})