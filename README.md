
## Luna Programming Language

<img src="luna.png" align="center" width="50%">

Luna Programming Language was designed to extend and improve Lua functionalities and portability, by generating bytecode files (luac) for Lua Virtual Machine (LVM). Luna was written in pure TypeScript for Node.js, based on “X Programming Language” - a programming language developed by Gabriel Margarido for educational purposes of how to write a compiler. Luna was also designed based on Ruby’s syntax, Java’s work-like and Lua’s speed and portability.

[“Transpiladores - Técnicas e Ferramentas (2ª edição)”](http://xlang.gabrielmargarido.org/) and [Linguagem de programação X](http://xlang.gabrielmargarido.org/) were developed by Gabriel Margarido


### Developed from Scratch
Luna Compiler (LunaC) was developed from scratch only with RegEx and TypeScript Arrays, by processing them into a single flow with reserved keywords. Its indexes positions and grammar relations built the LunaC compiler for an extended Lua Programming Language with Ruby-like syntax, features and speed of Lua language with Lua existing code integration.

### Compiles to Lua VM bytecode
LunaC generates luac files as output, the generated code isn’t human-readable. Only the Lua Virtual Machine (LVM) can read and run the output code, same as Java Virtual Machine class files.


### Interpreted or Compiled
You can compile and build from sources LunaC and LPM (Luna Package Manager) as single-binaries or interpret each TypeScript/Javascript source files with Node.js. Compile them to single-binaries is more convenient and portable, however if the running platform does not support Luna binaries compilation, you can interpret them with Node.js by compiling it first.


### Extending functionalities with Lua and Luna
Libraries can be written in Lua (lua or luac) files or Luna bytecodes (luac) and imported with import or import-as commands inside Luna source-code files. It ables developers to extend LunaC functionalities with Lua or Luna, and you can also develop for game engines and frameworks like: LÖVE2D, CoronaSDK or even Roblox with Luna as unique or main-language.


### LunaC Compiler and LPM Package Manager

LunaC compiles from Luna source-code files (.luna) to Lua Virtual Machine bytecodes (.luac), adding functionalities like: Oriented-Object Programming, Operating System and CPU Architecture Recognition, Ruby-like syntax, private and public modifiers, global variables aren’t default, classes and modules features, online own package manager (it can download modules written in Lua or in Lua from every URL) - It also generates automatically a cache file “deps.config” to maximize compatibility between different machines and operating systems. You can download all modules from all projects to a global cache on the operating system, by running: lpm --config You can see Luna Package Manager (LPM) as an improved Node Package Manager (NPM) from Node.js and Deno (npm:url).


### Free and OpenSource
LunaC and all of its tools are available for download under BSD (2-clause) free and opensource software license, you can even merge free and proprietary software in one project without license restrictions, unlike: GNU General Public License (GPL). You are free to do whatever you need or you like, with minimal license restrictions.


**Luna requires to be built:**
- Node.js ([Runtime Javascript](https://nodejs.org/pt-br/))
- NPM ([Gerenciador de Pacotes](https://www.npmjs.com/))
- [GNU Makefile](https://community.chocolatey.org/packages/make#install) or [CMason](http://cmason.gabrielmargarido.org/)
- PKG ([NPM Module](https://www.npmjs.com/package/pkg))


## Free and Open Source software
Entire Luna programming language source-code is available
under FreeBSD (2-clause) license as free and open source software.


## Install Visual Studio Code Extension
Installing VSCode extension by copying diretory "luna-vscode"
to corresponding location

```
$>  unzip luna-vscode.zip
$>  mv vscode/luna-vscode $HOME/.vscode/extensions/luna-vscode
```

- Windows:		```%USERPROFILE%\.vscode\extensions\luna-vscode```
- MacOS X:	  	```$HOME/.vscode/extensions/luna-vscode```
- GNU/Linux: 	```$HOME/.vscode/extensions/luna-vscode```