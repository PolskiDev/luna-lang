// xpm -i https://go.com/tsc.js
import * as download from 'download'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'

import * as os from './os'

const version = "1.2"
const URL = process.argv[3];
let downloadedPath;

/* Detect Operating System*/
if(os.linux) {
    downloadedPath = `${os.libs_path_linux}`;
}
if(os.darwin) {
    downloadedPath = `${os.libs_path_darwin}`;
}
if(os.freebsd) {
    downloadedPath = `${os.libs_path_freebsd}`;
}
if(os.openbsd) {
    downloadedPath = `${os.libs_path_openbsd}`;
}
if(os.solaris) {
    downloadedPath = `${os.libs_path_solaris}`;
}
if(os.windows) {
    downloadedPath = `${os.libs_path_win32}`;
}


// Define o arquivo de configuracao
let config_file:string = "deps.config"

// Escritor do arquivo de configuracao
function configWriter(buffer:string, url:string) {
    try {
        // Tenta ler o arquivo de configuracao
        // e adiciona o repositório
        let reader = fs.readFileSync(buffer)
        if(!reader.includes(url)) {
            if(fs.existsSync(buffer)) {
                fs.appendFileSync(buffer,url+"\n")
            } else {
                fs.writeFileSync(buffer,url+"\n")
            }
        }
    } catch {
        // Se nao conseguir, cria um arquivo
        // novo e adiciona o repositorio
        fs.writeFileSync(buffer,url+"\n")
    }
}

// Leitor do arquivo de configuracao
function configReader(file:string) {
    let data = fs.readFileSync(file,'utf-8')  // Le o arquivo informado como UTF-8
    let result = data.split(/\n/);  // Separa por quebra de linha
    for(var i in result) {
        console.log(result[i])
        
        // Obtem "file.txt" a partir de "https://www.meusite.com.br/repositorio/file.txt"
        let module_package = result[i].slice(result[i].lastIndexOf("/")+1,result[i].length)

        // Baixa arquivos via HTTP
        if(result[i].includes("http://")) {
            http.get(result[i], (res) => {
    
              // Onde salvar o arquivo (path)
              const path = `${downloadedPath}/${module_package}`;
              const writeStream = fs.createWriteStream(path);
            
              res.pipe(writeStream);
            
              writeStream.on("finish", () => {
                writeStream.close();
                // Sucesso
                console.log(`Module ${URL} was successfully stored at ${file}!`)
              });
            });

        // Baixa arquivos via HTTPS
        } else if(result[i].includes("https://")) {
            https.get(result[i], (res) => {

                // Onde salvar o arquivo (path)
                const path = `${downloadedPath}/${module_package}`;
                const writeStream = fs.createWriteStream(path);
              
                res.pipe(writeStream);
              
                writeStream.on("finish", () => {
                  writeStream.close();
                  // Sucesso
                  console.log(`Module ${result[i]} was successfully stored at ${file}!`)
                });
              });
        }
    }   
}



/* CLI */
if(process.argv[2] == "-i") {
    download(URL,downloadedPath)
    .then(() => {
    console.log(`Module ${URL} was successfully downloaded!`);
    
    // Adiciona repositorio no arquivo de configuracao
    configWriter(config_file,URL)


})
} else if (process.argv[2] == "--config") {
    // Similar a "npm install"
    configReader(config_file)


} else if (process.argv[2] == "-u") {
    try {
        fs.unlinkSync(`${downloadedPath}/${URL}`)
    } catch {
        console.error(`Cannot uninstall module or library ${URL} at ${downloadedPath} (${downloadedPath}/${URL}). Try using -u option with superuser privileges (sudo), (su -) or open a terminal window as System Administrator`)
    }
} else if (process.argv[2] == "--version") {
    console.log(`\nCurrent XPM version: ${version}\n`)
} else {
    console.log("--- Luna Programming Language Package Manager ----\n")
    console.log("lpm --version\n")
    console.log("----------------INSTALLING MODULES-------------")
    console.log("lpm -i http://yoursite.com.br/file.js")
    console.log("lpm -i http://yoursite.com.br/file.ts")
    
    console.log("\n----------------UNINSTALLING MODULES-----------")
    console.log("lpm -u file.js")
    console.log("lpm -u file.ts")
    console.log("-------------------------------------------------")

    console.log("\n-------DOWNLOAD DEV DEPENDENCIES (MODULES)------")
    console.log("lpm --config")
    console.log("-----------------------------------------------\n\n")
}