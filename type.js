var TypeComponent = Component(
    [
        [TextComponent]
    ],

    ['type'],
    ['typeChange'],

    function(type, typeChange) {

    },

    function(type, typeChange) {
        var typeName = this.view[0]
        typeName.value = type.name
    }
)