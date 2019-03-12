var ItemEditorComponent = AnonimComponent(
    [
        [GridComponent, [
            [NameEditorComponent],
            ['span', [
                [TextComponent]
            ]]
        ]]
    ],

    ['value'],
    ['valueChange'],

    function(value, valueChange) {
        var deleteButton = this.view[0][0][1]
        var deleteButtonElement = deleteButton.element
        var deleteButtonStyle = deleteButtonElement.style

        deleteButton[0].value = '+'

        deleteButtonStyle.display    = 'none'
        deleteButtonStyle.transform  = 'rotate(45deg)'
        deleteButtonStyle.cursor     = 'pointer'
        deleteButtonStyle.userSelect = 'none'

        deleteButtonElement.onclick = function(event) {
            event.stopPropagation()
            valueChange({type: 'delete'})
        }

        var wrapper = this.view[0][0]
        var wrapperElement = wrapper.element
        var wrapperStyle = wrapperElement.style

        wrapperStyle.padding      = '5px'
        wrapperStyle.cursor       = 'pointer'
        wrapperStyle.borderBottom = '1px solid rgba(149, 220, 164, 0.28)'

        wrapperElement.onmouseover = function() {
            deleteButtonStyle.display = 'inline-block'
            wrapperStyle.backgroundColor = '#54bf39'
        }

        wrapperElement.onmouseleave = function() {
            deleteButtonStyle.display = 'none'
            wrapperStyle.backgroundColor = 'initial'
        }

        wrapperElement.onclick = function(event) {
            event.stopPropagation()
            valueChange({type: 'select'})
        }

        var nameEditor = this.view[0][0][0]

        nameEditor.valueChange = function(newName) {
            valueChange({
                type: 'renaming',
                newName: newName
            })
        }
    },

    function(value, valueChange) {
        var wrapper = this.view[0]
        wrapper.columns = 'auto min-content'
        wrapper.gap = '10px'

        var nameEditor = this.view[0][0][0]
        nameEditor.value = value.name
    }
)

var ItemsEditorComponent = AnonimComponent(
    [
        [RectangleComponent, [
            [ScrollComponent, [
                [ListComponent]
            ]],
            [ButtonComponent]
        ]]
    ],

    ['items'],
    ['itemSelected', 'itemDeleted', 'itemAdded', 'itemNameChanged'],

    function(items, itemSelected, itemDeleted, itemAdded, itemNameChanged) {
        var wrapper = this.view[0]
        var wrapperStyle = wrapper[0].element.style
        wrapper.width = '200px'
        wrapper.padding = '10px'
        wrapperStyle.backgroundColor = '#fff'

        var scroll = this.view[0][0][0]
        scroll.height = '200px'

        var itemsList = this.view[0][0][0][0][0]
        itemsList.template = ItemEditorComponent

        itemsList.itemChange = function(itemData) {
            var eventType = itemData.data.type

            if(eventType == 'select')
                itemSelected(itemData.index)
            else if(eventType == 'delete')
                itemDeleted(itemData.index)
            else if(eventType == 'renaming')
                itemNameChanged({
                    index: itemData.index,
                    newName: itemData.data.newName
                })
        }

        var addButton = this.view[0][0][1]

        addButton.click = itemAdded
    },

    function(items, itemSelected, itemDeleted, itemAdded, itemNameChanged) {
        var itemsList = this.view[0][0][0][0][0]
        itemsList.items = items
    }
)