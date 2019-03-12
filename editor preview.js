function addElementInPreview(parent, component) {
    var element

    var ElementComponent = AnonimComponent(
        [
            [RectangleComponent, [
                [component]
            ]]
        ],

        [],
        [],

        function() {
            var rectangleElement = this.view[0][0].element
            var style = rectangleElement.style

            rectangleElement.onclick = function() {
                //alert()
                //console.log(t)
                //window.currentElement = element
                elementEditor.element = element
            }

            rectangleElement.onmouseenter = function() {
                style.outline = '1px solid #000'
            }

            rectangleElement.onmouseleave = function() {
                style.outline = 'none'
            }
            //console.log(rectangleElement)
        },

        function() {

        }
    )

    //component(parent)

    element = ElementComponent(parent)
}

var EditorPreviewComponent = AnonimComponent(
    [
        ['div', []]
    ],

    [],
    [],

    function() {
        var element = this.view[0].element

        element.ondragenter = function(event) {
            event.returnValue = false
        }

        element.ondragover = function(event) {
            event.returnValue = false
        }

        element.ondrop = function(event) {
            var elementType = event.dataTransfer.getData('data')
            var elementIndex = parseInt(elementType)

            addElementInPreview(element, components[elementIndex])
            
            /*
            switch(elementType) {
                case 'button':
                    addElementInPreview(element, ButtonComponent)
                    //ButtonComponent(element)
                    break

                case 'text':
                    addElementInPreview(element, TextComponent)
                    //TextComponent(element)
                    break
            }
            */
        }
    },

    function() {
        
    }
)