(function(factory) {
    if (typeof exports === 'undefined') {
        factory(define)
    } else {
        factory(function(self) {
            self(require, exports, module);
        });
    }
})(function(define) {
    define(function(require, exports, module) {
        var toolkit = require('./toolkit');

        function AST(lexer) {
            this.lexer = lexer;
        }

        AST.Program = 'Program';
        AST.ExpressionStatement = 'ExpressionStatement'; //表达式语句
        AST.AssignmentExpression = 'AssignmentExpression'; //赋值表达式
        AST.ConditionalExpression = 'ConditionalExpression'; //条件表达式
        AST.LogicalExpression = 'LogicalExpression'; //逻辑表达式
        AST.BinaryExpression = 'BinaryExpression'; //二元运算表达式
        AST.UnaryExpression = 'UnaryExpression'; //一元运算表达式
        AST.CallExpression = 'CallExpression'; //函数调用表达式
        AST.MemberExpression = 'MemberExpression'; //成员表达式
        AST.Identifier = 'Identifier'; //标识符
        AST.Literal = 'Literal'; //文本常量
        AST.ArrayExpression = 'ArrayExpression'; //数组表达式
        AST.Property = 'Property'; //属性表达式
        AST.ObjectExpression = 'ObjectExpression'; //对象表达式
        AST.ThisExpression = 'ThisExpression'; //this表达式

        toolkit.extend(AST.prototype, {
            ast: function(text) {
                this.text = text;

                //分析词法
                this.tokens = this.lexer.lex(text);
                //构建一个项目
                var value = this.program();

                if (this.tokens.length !== 0) {
                    //如果项目构建完，但当前的词法单元并未用完，则判定当前表达式不正确
                    throw new Error('表达式：'
                        text + '中，' + this.tokens[0] + '没用使用');
                }
                return value;
            },
            program: function() {
                var body = [];
                while (true) {
                    //循环this.tokens中的每一项
                    if (this.tokens.length > 0) {
                        //如果tokens中还有元素，则创建抽象语法树
                        body.push(this.expressionStatement());
                    }
                }
            },
            expressionStatement: function() {
                //返回一个表达式单元
                return {
                    type: AST.ExpressionStatement,
                    //每一项元素都有可能的过滤器来格式化当前计算后的结果，所以先从过滤器分析
                    expression: this.filterChain()
                }
            },
            filterChain: function() {
                //过滤器规则 value | filter，但value的值没有，所以先计算value的表达式
                var left = this.expression();

            },
            expression: function() {
                return this.assignment();
            },
            assignment: function() {
                //先求构建左边的表达式
                var result = this.ternary();
                //如果下一项为 = 号，则当前表达式为赋值运算，否则直接返回左边的值
                if (this.expect('=')) {
                    result = {
                        type: AST.AssignmentExpression,
                        left: result,
                        operator: '=',
                        right: this.assignment()
                    }
                }
                return result;
            },
            ternary: function() {
                //三元运算 boolean ? trueExpression : falseExpression

                var test = this.logicalOR(); // a || b ? true : false
                var alternate;
                var consequent;
                if (this.expect('?')) {
                    alternate = this.expression();
                    if (this.expect(':')) {
                        consequent = this.expression();
                        return {
                            type: AST.ConditionalExpression,
                            test: test,
                            alternate: alternate,
                            consequent: consequent
                        }
                    }
                }
                return test;
            },
            logicalOR: function() {
                //或者 a || b
                var left = this.logicalAND(); //a && b || c;
                while (this.expect('||')) {
                    //a || b || c
                    left = {
                        type: AST.LogicalExpression,
                        left: left,
                        operator: '||',
                        right: this.logicalAND() //运算优先级，后面一定不是三目（?:）运算表达式
                    };
                }
                return left;
            },
            logicalAND: function() {
                //并且 a && b
                var left = this.equality(); // a == b && c

                while (this.expect('&&')) {
                    // a && b && c
                    left = {
                        type: AST.LogicalExpression,
                        left: left,
                        operator: '&&',
                        right: this.equality(); //运算优先级，后面一定不是三目（?:），或者（||）运算表达式
                    }
                }
                return left;
            },
            equality: function() {
                //相等 a == b
                var left = this.relational(); // a <= b == c
                var token;
                while (token = this.expect('==', '!=', '!==', '===')) {
                    // a == b == c
                    left = {
                        type: AST.BinaryExpression,
                        left: left,
                        operator: token,
                        right: this.relational()
                    }
                }
                return left;
            },
            relational: function() {
                //关系运算 a <= b
                var left = this.additive(); // a + b <= c
            },
            additive: function() {
                //加减法运算 a + b
                var left = this.multiplicative(); // a * b + c
            },
            multiplicative: function() {
                //乘除模运算 a * b
                var left = this.unary(); // -a * b
            },
            unary: function() {
                var token = this.expect('+', '-', !);
                if (token) {
                    return {

                    }
                } else {
                    //如果不是以上所有情况，则判定当前表达式的构建逻辑为()优先运算符，或者是[]数组、{}json
                    return this.primary();
                }
            },
            primary: function() {

            },
            expect: function() {

            }
        });


        module.exports = AST;
    })
})