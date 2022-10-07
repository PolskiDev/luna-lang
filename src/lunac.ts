import * as fs from 'fs';
import { stdout } from 'process';
import { execSync } from 'child_process';
import * as tok from './lex';
import * as os from './os';
import * as luaclass from './class_def';


let execfile = process.argv[1];
const version = "1.1"


var procmode;
export var inputfile;
export var asm;
export let segment; // HERE
export let linked_file; // HERE
export let bytecode_file;
if (process.argv[2]) { procmode = process.argv[2]; }
if (process.argv[3]) {
    inputfile = process.argv[3]
    asm = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OBJECT_FILE; //HERE
    linked_file = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.OUTPUT_FILE_EXTENSIONS; //HERE
    bytecode_file = process.argv[3].slice(0,process.argv[3].search(/\./))+tok.BYTECODE_FILE_EXTENSIONS;
}



let t:any = [];
let filein:any;
if(procmode == "-c") {
    filein = fs.readFileSync(inputfile,'utf8');
    //t = filein.split(/\s+/);
    //t = filein.match(/\w+|"[^"]+"/g)
    //t = filein.match(/\w+|"[^"]+"|\([^)]*\)|\[[^\]]*\]|(:)|(=)|(\$)|(\+)/g)
    t = filein.match(/[A-Za-z0-9_$++::.,@#><>=<=>===:=\[\]]+|"[^"]+"|\([^)]*\)|\[[^\]]*\]|(:)|(=)/g)
    //t = filein.split(/"[^"]+"|([^"]+)/g)
    //t = filein.split(/([a-z][A-Z])(?=(?:[^'"]|["'][^'"]*["'])*$)/g)

    if (fs.existsSync(__dirname+asm)) {
        fs.unlinkSync(__dirname+asm);
    }
    if (fs.existsSync(__dirname+linked_file)) {
        fs.unlinkSync(__dirname+linked_file);
    }
    if (fs.existsSync(__dirname+bytecode_file)) {
        fs.unlinkSync(__dirname+bytecode_file);
    }
}


export function asmCompileFunction() {
    for(var token in t) {
        t.push(token);
        if(process.argv[4] == "--debug") {
            stdout.write("\x1b[33m{"+t[token]+"} ");
        }
    }    
    // TST - Token Syntax Tree    
    for (var i=0; i < t.length; i++) {
        /** Begin program */
        let usingStdMethod
        if(t[i] == tok.using_0
        && t[i+1] == tok.using_1 && t[i+2] == tok.using_2) {
            usingStdMethod = true
        }

        if (t[i] == tok.start) {
            fs.writeFileSync(asm,"-- INICIO\n")
            fs.appendFileSync(asm,luaclass.inspect_definition)
            fs.appendFileSync(asm,luaclass.factorial_definition)
            fs.appendFileSync(asm,luaclass.class_definition)
            fs.appendFileSync(asm,luaclass.os_definition)
            fs.appendFileSync(asm,luaclass.readFile_definition)
        }
        if (t[i] == tok.end) {
            fs.appendFileSync(asm,"main()\n-- FIM\n")
        }
        
        /* Comentários */
        if (t[i] == tok.comment) {
            fs.appendFileSync(asm,"--")
        }

        /** Detecting Operating System */
        if(t[i] == tok.if_unix) {
            fs.appendFileSync(asm,`if getEnvironmentOS() == 'Unix' then\n`)
        }
        if(t[i] == tok.if_win32) {
            fs.appendFileSync(asm,`if getEnvironmentOS() == 'Windows' then\n`)
        }

        /** Detecting CPU architecture */
        if(t[i] == tok.if_x86) {
            fs.appendFileSync(asm,`if getEnvironmentArch() == 'x86' then\n`)
        }
        if(t[i] == tok.if_x86_64) {
            fs.appendFileSync(asm,`if getEnvironmentArch() == 'x86_64' then\n`)
        }
        if(t[i] == tok.if_powerpc) {
            fs.appendFileSync(asm,`if getEnvironmentArch() == 'powerpc' then\n`)
        }
        if(t[i] == tok.if_arm) {
            fs.appendFileSync(asm,`if getEnvironmentArch() == 'arm' then\n`)
        }
        if(t[i] == tok.if_mips) {
            fs.appendFileSync(asm,`if getEnvironmentArch() == 'mips' then\n`)
        }



        if(t[i] == tok.webimport) {
            let path = t[i+1].slice(1,-1)
            if(os.linux) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_linux}/${path}`))
            }
            if(os.darwin) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_darwin}/${path}`))
            }
            if(os.freebsd) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_freebsd}/${path}`))
            }
            if(os.openbsd) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_openbsd}/${path}`))
            }
            if(os.solaris) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_solaris}/${path}`))
            }
            if(os.windows) {
                fs.appendFileSync(asm,fs.readFileSync(`${os.libs_path_win32}\\${path}`))
            }

        }

        if(t[i] == tok.inspect) {
            if(t[i+2] == tok.strategy_tok) {
                fs.appendFileSync(asm,`local ${t[i+3]} = inspect(${t[i+1]})\n`)
            } else {
                fs.appendFileSync(asm,`print(inspect(${t[i+1]}))\n`)
            }
            
        }
        
        if(t[i] == tok.os_execute) {
            fs.appendFileSync(asm,`os.execute(${t[i+1]})\n`)
        }

        if(t[i] == tok.lua_module) {
            fs.appendFileSync(asm,`${t[i+1]} = {}\n`)
        }
        if(t[i] == tok.include) {
            let path = t[i+1]
            fs.appendFileSync(asm,fs.readFileSync(path))
        }

        if (t[i] == tok.require_import) {
            let path = t[i+1]
            let name = t[i+3]

            if(t[i+2] == tok.as_import) {
                fs.appendFileSync(asm,`local ${name} = require(${path})\n`)
            } else {
                fs.appendFileSync(asm,`require(${path})\n`)
            }
            
        }

        if(t[i] == tok.io_readfile) {
            let filename = t[i+1].slice(1,-1)
            let strategy = t[i+2]
            let visibility = t[i+3]
            let varname = t[i+4]

            if(strategy == tok.strategy_tok) {
                if(visibility == tok.public_tok || visibility == tok.default_tok) {
                    fs.appendFileSync(asm,`${varname} = ioscan_read_file(${filename})\n`)
                } else if (visibility == tok.private_tok) {
                    fs.appendFileSync(asm,`local ${varname} = ioscan_read_file(${filename})\n`)
                }
            } else {
                console.log(`\n\n\x1b[33mERROR 1000: Use (${tok.strategy_tok}) to do strategy to read file (${filename}).\n\n`);
            }
        }
        
        
        
        if(t[i] == tok.io_writefile) {
            let filename = t[i+1].slice(1,-1)
            let strategy = t[i+2]
            let text = t[i+3]
            let varname = filename.replace(/\./,"_").slice(1,-1)

            if(strategy == tok.strategy_tok) {
                fs.appendFileSync(asm,`local ${varname} = io.open(${filename},'w')\n`)
                fs.appendFileSync(asm,`${varname}:write(${text})\n`)
                fs.appendFileSync(asm,`${varname}:flush()\n`)
                fs.appendFileSync(asm,`${varname}:close()\n`)
            } else {
                console.log(`\n\n\x1b[33mERROR 1000: Use (${tok.strategy_tok}) to do strategy to create new file (${filename}).\n\n`);
            }    
        }
        if(t[i] == tok.io_appendfile) {
            let filename = t[i+1].slice(1,-1)
            let strategy = t[i+2]
            let text = t[i+3]
            let varname = filename.replace(/\./,"_").slice(1,-1)

            if(strategy == tok.strategy_tok) {
                fs.appendFileSync(asm,`local ${varname} = io.open(${filename},'a')\n`)
                fs.appendFileSync(asm,`${varname}:write(${text})\n`)
                fs.appendFileSync(asm,`${varname}:flush()\n`)
                fs.appendFileSync(asm,`${varname}:close()\n`)
            } else {
                console.log(`\n\n\x1b[33mERROR 1000: Use (${tok.strategy_tok}) to do strategy to append file (${filename}).\n\n`);
            }    
        }


        if(t[i] == tok.io_writefileln) {
            let filename = t[i+1].slice(1,-1)
            let strategy = t[i+2]
            let text = t[i+3]
            let varname = filename.replace(/\./,"_").slice(1,-1)

            if(strategy == tok.strategy_tok) {
                fs.appendFileSync(asm,`local ${varname} = io.open(${filename},'w')\n`)
                fs.appendFileSync(asm,`${varname}:write(${text}.."\\n")\n`)
                fs.appendFileSync(asm,`${varname}:flush()\n`)
                fs.appendFileSync(asm,`${varname}:close()\n`)
            } else {
                console.log(`\n\n\x1b[33mERROR 1000: Use (${tok.strategy_tok}) to do strategy to create new file (${filename}).\n\n`);
            }    
        }
        if(t[i] == tok.io_appendfileln) {
            let filename = t[i+1].slice(1,-1)
            let strategy = t[i+2]
            let text = t[i+3]
            let varname = filename.replace(/\./,"_").slice(1,-1)

            if(strategy == tok.strategy_tok) {
                fs.appendFileSync(asm,`local ${varname} = io.open(${filename},'a')\n`)
                fs.appendFileSync(asm,`${varname}:write(${text}.."\\n")\n`)
                fs.appendFileSync(asm,`${varname}:flush()\n`)
                fs.appendFileSync(asm,`${varname}:close()\n`)
            } else {
                console.log(`\n\n\x1b[33mERROR 1000: Use (${tok.strategy_tok}) to do strategy to append file (${filename}).\n\n`);
            }    
        }

        if(t[i] == tok.public_tok || t[i] == tok.default_tok) {
            if(t[i+1] == tok.class_tok) {
                let class_name = t[i+1+1]
                let isExtended = t[i+2+1]
                let extended_class = t[i+3+1]
    
                if(isExtended == tok.inheritance_tok) {
                    fs.appendFileSync(asm,`${class_name} = ${extended_class}:extend()\n`)
                } else {
                    fs.appendFileSync(asm,`${class_name} = class()\n`)
                }
            }
            if(t[i+1] == tok.new_tok) {
                let obj_name = t[i+1+1]
                let class_name = t[i+3+1]
                
                if(t[i+2+1] == tok.inverse_strategy_tok) {
                    fs.appendFileSync(asm,`${obj_name} = ${class_name}:new()`)
                } else {
                    console.log('\x1b[31m',`Use (${tok.inverse_strategy_tok}) to get the return of [${obj_name}].`)
                }
                
            }
            if(t[i+1] == tok.function_token) {
                let name = t[i+1+1]
                let params = t[i+2+1]
                name = name.replace(tok.lua_module_separator,".")

                //FIX HERE
                /*params = params.replace(tok.datatypes[0],tok.datatypes_target[0])
                params = params.replace(tok.datatypes[1],tok.datatypes_target[1])
                params = params.replace(tok.datatypes[2],tok.datatypes_target[2])
                params = params.replace(tok.datatypes[3],tok.datatypes_target[3])
                params = params.replace(tok.datatypes[4],tok.datatypes_target[4])*/         
                fs.appendFileSync(asm,`function ${name}${params}\n`)
            }
            if(t[i+1] == tok.array) {
                let name = t[i+1+1]
                let val = t[i+3+1]
                name = name.replace(tok.lua_module_separator,".")


                /*tof = tof.replace(tok.datatypes[0],tok.datatypes_target[0])
                tof = tof.replace(tok.datatypes[1],tok.datatypes_target[1])
                tof = tof.replace(tok.datatypes[2],tok.datatypes_target[2])
                tof = tof.replace(tok.datatypes[3],tok.datatypes_target[3])
                tof = tof.replace(tok.datatypes[4],tok.datatypes_target[4])*/
    
                fs.appendFileSync(asm,`${name} = {${val}}\n`)
            }
        }
        if(t[i] == tok.private_tok) {
            if(t[i+1] == tok.class_tok) {
                let class_name = t[i+1+1]
                let isExtended = t[i+2+1]
                let extended_class = t[i+3+1]
    
                if(isExtended == tok.inheritance_tok) {
                    fs.appendFileSync(asm,`local ${class_name} = ${extended_class}:extend()\n`)
                } else {
                    fs.appendFileSync(asm,`local ${class_name} = class()\n`)
                }
            }
            if(t[i+1] == tok.new_tok) {
                let obj_name = t[i+1+1]
                let class_name = t[i+3+1]
                
                if(t[i+2+1] == tok.inverse_strategy_tok) {
                    fs.appendFileSync(asm,`local ${obj_name} = ${class_name}:new()`)
                } else {
                    console.log('\x1b[31m',`Use (${tok.inverse_strategy_tok}) to get the return of [${obj_name}].`)
                }
                
            }
            if(t[i+1] == tok.function_token) {
                let name = t[i+1+1]
                let params = t[i+2+1]
                name = name.replace(tok.lua_module_separator,".")
    
                /*params = params.replace(tok.datatypes[0],tok.datatypes_target[0])
                params = params.replace(tok.datatypes[1],tok.datatypes_target[1])
                params = params.replace(tok.datatypes[2],tok.datatypes_target[2])
                params = params.replace(tok.datatypes[3],tok.datatypes_target[3])
                params = params.replace(tok.datatypes[4],tok.datatypes_target[4])*/         
                fs.appendFileSync(asm,`local function ${name}${params}\n`)
            }
            if(t[i+1] == tok.array) {
                let name = t[i+1+1]
                let val = t[i+3+1]
                name = name.replace(tok.lua_module_separator,".")

                /*tof = tof.replace(tok.datatypes[0],tok.datatypes_target[0])
                tof = tof.replace(tok.datatypes[1],tok.datatypes_target[1])
                tof = tof.replace(tok.datatypes[2],tok.datatypes_target[2])
                tof = tof.replace(tok.datatypes[3],tok.datatypes_target[3])
                tof = tof.replace(tok.datatypes[4],tok.datatypes_target[4])*/
    
                fs.appendFileSync(asm,`local ${name} = {${val}}\n`)
            }
        }   

        if (t[i] == tok.assign_new) {
            let name = t[i+1]
            let val = t[i+3]

            name = name.replace(tok.lua_module_separator,".")
            fs.appendFileSync(asm,`${name} = ${val}\n`)
        }



        if (t[i] == tok.global_variable) {
            let name = t[i+1]
            let val = t[i+3]
            name = name.replace(tok.lua_module_separator,".")
            //val = val.replace("+","..") // HERE

            if(t[i+2] != tok.assign) {
                console.log(`\n\n\x1b[33mERROR 1000: Use (${tok.assign}) on variable (${name}) assignment\n\n`);    
            } else {
                if(t[i+4].slice(0,1) == "(") {
                    fs.appendFileSync(asm,`${name} = ${val}${t[i+4]}\n`)
                } else {
                    fs.appendFileSync(asm,`${name} = ${val}\n`)
                }   
            }
        }
        if (t[i] == tok.local_variable) {
            let name = t[i+1]
            let val = t[i+3]
            name = name.replace(tok.lua_module_separator,".")
            //val = val.replace("+","..") // HERE

            if(t[i+2] != tok.assign) {
                console.log(`\n\n\x1b[33mERROR 1000: Use (${tok.assign}) on variable (${name}) assignment\n\n`);    
            } else {
                if(t[i+4].slice(0,1) == "(") {
                    fs.appendFileSync(asm,`local ${name} = ${val}${t[i+4]}\n`)
                } else {
                    fs.appendFileSync(asm,`local ${name} = ${val}\n`)
                }   
            }
        }


        // HERE
        if(t[i] == tok.return_tok) {
            fs.appendFileSync(asm,`return ${t[i+1]}\n`)
        }

        if(t[i] == tok.function_call) {
            let name = t[i+1]
            let params = t[i+2]
            let tof = t[i+4]
            let return_name = t[i+5]

            name = name.replace(tok.lua_module_separator,".")

            if(t[i+3] != tok.function_call_symbol) {
                console.log(`\n\n\x1b[33mERROR 1002: Use (${tok.function_delimiter}) to get function ${name} return.\n\n`);
            } else { 
                if(tof == tok.none) {
                    fs.appendFileSync(asm,`${name}${params}\n`)
                } else {
                    fs.appendFileSync(asm,`local ${return_name} = ${name}${params}\n`)
                }
                
            }
        }

        if (t[i] === tok.std_in) {
            let visibility = t[i+2]
            let varname = t[i+3]

            if(visibility == tok.public_tok || visibility == tok.default_tok) {
                fs.appendFileSync(asm,`${varname} = io.read()\n`)
            } else {
                fs.appendFileSync(asm,`local ${varname} = io.read()\n`)
            }
            
        }
        if (t[i] == tok.std_out) {
            let val = t[i+1]
            val = val.replace(tok.lua_module_separator,".")
           //val = val.replace("+","..")

            if(t[i+2].slice(0,1) == "(") {
                fs.appendFileSync(asm,`io.write(${val}${t[i+2]})\n`)
            } else {
                fs.appendFileSync(asm,`io.write(${val})\n`)
            }
        }
        if (t[i] == tok.std_outln) {
            let val = t[i+1]
            val = val.replace(tok.lua_module_separator,".")
            //val = val.replace("+","..")
            
            if(t[i+2].slice(0,1) == "(") {
                fs.appendFileSync(asm,`print(${val}${t[i+2]})\n`)
            } else {
                fs.appendFileSync(asm,`print(${val})\n`)
            }
        }

        if (t[i] == tok.if_block) {
            let first = t[i+1]
            let operator = t[i+2]
            let second = t[i+3]
            fs.appendFileSync(asm,`if ${first} ${operator} ${second} then\n`)
        }
        if (t[i] == tok.elsif_block) {
            let first = t[i+1]
            let operator = t[i+2]
            let second = t[i+3]
            fs.appendFileSync(asm,`elseif ${first} ${operator} ${second} then\n`)
        }
        if (t[i] == tok.else_block) {
            fs.appendFileSync(asm,`else\n`)
        }
        

        if(t[i] == tok.loop) {
            fs.appendFileSync(asm,`while true do\n`)
        }
        if (t[i] == tok.while_tok) {
            let first = t[i+1]
            let operator = t[i+2]
            let second = t[i+3]
            fs.appendFileSync(asm,`while ${first} ${operator} ${second} do\n`)
        }
        if(t[i] == tok.break_tok) {
            fs.appendFileSync(asm,`break\n`)
        }
        if (t[i] == tok.for_tok) {
            let iterator = t[i+1]
            let min = t[i+3].slice(0,t[i+3].search(/\./))
            let max = t[i+3].slice(t[i+3].search(/\./)+2,t[i+3].length)

            if(t[i+2] != tok.in_tok) {
                console.log(`\n\n\x1b[33mERROR 1003: Use (for ${iterator} ${tok.in_tok} ${min}..${max} do)\n\n`);
            } else {
                fs.appendFileSync(asm,`for ${iterator}=${min},${max} do\n`)
            }
            
        }


        if(t[i] == tok.math_exp) {
            let exp = t[i+1].slice(1,-1)
            let visibility = t[i+3]
            let varname = t[i+4]

            if (visibility == tok.public_tok
            || visibility == tok.default_tok) {
                fs.appendFileSync(asm,`${varname} = ${exp}\n`)
            } else if (visibility == tok.private_tok) {
                fs.appendFileSync(asm,`local ${varname} = ${exp}\n`)
            }
            
        }

        if(t[i] == tok.function_then) {
            fs.appendFileSync(asm,"then\n")
        }
        if(t[i] == tok.function_do) {
            fs.appendFileSync(asm,"do\n")
        }
        if(t[i] == tok.end_block) {
            fs.appendFileSync(asm,"end\n")
        }
    }
}
function asmLinkFunction() { //HERE
    let module_file = fs.readFileSync(asm)
    fs.writeFileSync(linked_file,module_file) // MODIFIED
}
function LuaCBuildFunction() {
    /** COMMENT FOR TEST PURPOSES */
    
    let lua_file = process.argv[3].slice(0,process.argv[3].search(/\./))
    execSync(`luac -o ${lua_file}.luac ${lua_file}.lua`)
    if(fs.existsSync(linked_file)) {
        fs.unlinkSync(linked_file)
    }
}

if(procmode == "-c") {
    asmCompileFunction();
    asmLinkFunction();
    LuaCBuildFunction();
    
} else if(procmode == "--version") {
    console.log(`\nCurrent LunaC version: v${version}\n`)

} else {
    console.log("\n--- Luna Programming Language Compiler Syntax ---")
    console.log("Unix:  ./lunac -c <source>")
    console.log("Windows: lunac -c <source>")
    console.log("Example: lunac -c Main.luna\n")

    console.log("Unix:  ./lunac --version")
    console.log("Windows: lunac --version\n") 
} 
