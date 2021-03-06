function $ModelProvider() {
    this.$get = function() {
        return function model() {
            return new Model();
        };
    };

    function Model() {}
    extend(Model.prototype, {
        $new: function(scopeName, obj) {
            function a() {}
            a.prototype = this;
            var newModule = new a();
            this.$init.call(newModule, scopeName, obj);
            return newModule;
        }
    })
};
