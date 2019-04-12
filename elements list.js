function addElementInListComponent(element, data) {
    element.draggable = true

    element.ondragstart = function(event) {
        event.dataTransfer.setData('data', data)
    }
}

var ElementsList = AnonimComponent({
    name: 'ElementsList',

    structure: [
        ['wrapper', Rectangle, [
            [Scroll, [
                ['grid', Grid]
            ]]
            
        ]]
    ],

    init: function() {
        //this.wrapper.padding = '20px'
        this.wrapper.color = '#fff'

        //this.grid.rows = 'min-content min-content min-content min-content min-content'
        this.grid.gap = '8px'

        components.forEach((component, index) => {
            var elementWrapperComponent = AnonimComponent({
                name: 'element',

                structure: [
                    ['wrapper', Grid, [
                        ['preview', Rectangle],
                        ['name', Text]
                    ]]
                ],

                init: function() {
                    this.wrapper.columns = 'auto 100px'
                    this.wrapper.gap = '8px'

                    var style = this.wrapper.element.style
                    style.minHeight = '20px'
                    style.border = '1px solid rgba(0, 0, 0, 0)'

                    this.wrapper.element.onmouseenter = function() {
                        style.border = '1px solid #000'
                    }

                    this.wrapper.element.onmouseleave = function() {
                        style.border = '1px solid rgba(0, 0, 0, 0)'
                    }

                    this.drawedComponent = component(this.preview.element, [])
                    this.name.style = 'italic'
                    this.name.value = this.drawedComponent.name
                    addElementInListComponent(this.wrapper.element, index)
                }
            })

            elementWrapperComponent(this.grid.element)
        })
    }
})