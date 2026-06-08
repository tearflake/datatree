// data.js
// (c) tearflake, 2026.
// MIT License

"use strict";

var Data = (
    function (obj) {
        return {
            compile: obj.compile,
            removeComments: obj.removeComments
        };
    }
) (
    (function () {

        function compile(program) {
            let syntax = `
                (GRAMMAR
                    (RULE START grammar)

                    (RULE grammar
                        (LIST header
                            (LIST title
                                (LIST tree
                                    ()))))

                    (RULE header "DATA")
                    (RULE header "DATATREE")
                    
                    (RULE title
                        (LIST "TITLE"
                            (LIST ATOMIC
                                ())))
                    
                    (RULE tree
                        (LIST "TREE"
                            (LIST parent
                                (LIST children
                                    ()))))

                    (RULE parent
                        (LIST "PARENT"
                            listoflists))

                    (RULE children
                        (LIST "CHILDREN"
                            trees))

                    (RULE tree
                        (LIST "LEAF"
                            listoflists))
                    
                    (RULE trees
                        (LIST tree
                            trees))

                    (RULE trees
                        (LIST tree
                            ()))
                    
                    (RULE listoflists
                        (LIST list
                            listoflists))
                            
                    (RULE listoflists
                        (LIST list
                            ()))
                            
                    (RULE list
                        (LIST ATOMIC
                            next))

                    (RULE next
                        (LIST ATOMIC
                            next))
                    
                    (RULE next
                        (LIST ATOMIC
                            ()))

                )
            `;

            let sSyntax = SExpr.parse (syntax);
            let sProgram = SExpr.parse (program);
            
            if (sProgram.err) {
                return sProgram;
            }
            
            let ast = Parser.parse (program, sSyntax);
            
            if (!ast.err) {
                return ast;
            }
            else {
                let msg = SExpr.getPosition (program, skipComments (ast.path, ast));
                return msg;
            }
        }
        
        let removeComments = function (expr) {
            if (Array.isArray (expr)) {
                let result = []
                for (let i = 0; i < expr.length; i++) {
                    if (!Array.isArray (expr[i])) {
                        result.push (expr[i]);
                    }
                    else if (expr[i][0] !== "**") {
                        result.push (removeComments (expr[i]))
                    }
                }
                
                return result;
            }
            else {
                return expr;
            }
        }
        
        let skipComments = function (path, sexpr) {
            let result = [...path];
            let ts = sexpr;
            for (let i = 0; i < path.length; i++) {
                if (ts[result[i]]){
                    for (let j = 0; j <= result[i]; j++) {
                        if (ts[j] && ts[j][0] == "**") {
                            result[i]++;
                        }
                    }
                    
                    ts = ts[result[i]];
                }
            }
            
            return result;
        }

        return {
            compile: compile,
            removeComments: removeComments
        }
    }) ()
);

