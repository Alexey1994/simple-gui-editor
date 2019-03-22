function addElementInPreview(parent, component) {
    var element

    var ElementComponent = AnonimComponent(
        'element-preview',
        [
            ['rectangle', RectangleComponent, [
                ['wrappedComponent', component]
            ]]
        ],

        [],
        [],

        function() {

        },

        function() {
            var rectangleElement = this.rectangle.element
            var style = rectangleElement.style

            rectangleElement.onclick = function() {
                elementEditor.element = element
            }

            rectangleElement.onmouseenter = function() {
                style.outline = '1px solid #000'
            }

            rectangleElement.onmouseleave = function() {
                style.outline = 'none'
            }
        },

        function() {

        },

        function() {

        }
    )

    element = ElementComponent(parent)
}

var EditorPreviewComponent = AnonimComponent(
    'component-preview',
    null,

    [],
    [],

    function() {
        this.element = document.createElement('div')
        this.parentElement.appendChild(this.element)
    },

    function() {
        this.element.style.height = '100%'

        this.element.ondragenter = function(event) {
            event.returnValue = false
        }

        this.element.ondragover = function(event) {
            event.returnValue = false
        }

        var self = this

        this.element.ondrop = function(event) {
            var elementType = event.dataTransfer.getData('data')
            var elementIndex = parseInt(elementType)

            addElementInPreview(self.element, components[elementIndex])
        }
    },

    function() {
        
    },

    function() {

    }
)