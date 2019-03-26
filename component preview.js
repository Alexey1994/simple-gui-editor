var structure = []
var selectedComponent

function addElementInPreview(parent, component) {
    var element

    var Element = AnonimComponent({
        name: 'element-preview',
        
        structure: [
            ['rectangle', Rectangle, [
                ['wrappedComponent', component]
            ]]
        ],

        init: function() {
            this.rectangle.element.onclick = function() {
                selectedComponent = element

                if(elementEditor)
                    elementEditor.element = element
            }

            this.rectangle.element.onmouseenter = () => {
                this.rectangle.element.style.outline = '1px solid #000'
            }

            this.rectangle.element.onmouseleave = () => {
                this.rectangle.element.style.outline = 'none'
            }
        }
    })

    element = Element(parent)
    selectedComponent = element

    if(elementEditor)
        elementEditor.element = element
    
    structure.push(element)
}

var EditorPreview = AnonimComponent({
    name: 'component-preview',

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

            addElementInPreview(this.element, components[elementIndex])
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})