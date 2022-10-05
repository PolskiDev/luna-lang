all: build
	node src/lunac.js -c Main.luna
lua: build
	node src/lunac.js -l Main.luna

debug: build
	node src/lunac.js -c Main.luna --debug

npm:
	npm install --save-dev typescript @types/node
build:
	npx tsc src/*.ts

clean:
	rm -Rf src/*.js src/lib/*.js
