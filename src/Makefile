NPM=npm install --save-dev
TSC=npx tsc
CC=npx pkg
MAIN=lunac
AUX_PKG_MANAGER=lpm
# Manpage:   make help
# Build:     make all test

OSFLAG 				:=
ifeq ($(OS),Windows_NT)
	OSFLAG += -D WIN32
	ifeq ($(PROCESSOR_ARCHITECTURE),AMD64)
		OSFLAG += -D AMD64
	endif
	ifeq ($(PROCESSOR_ARCHITECTURE),x86)
		OSFLAG += -D IA32
	endif
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		OSFLAG += -D LINUX
	endif
	ifeq ($(UNAME_S),Darwin)
		OSFLAG += -D OSX
	endif
		UNAME_P := $(shell uname -p)
	ifeq ($(UNAME_P),x86_64)
		OSFLAG += -D AMD64
	endif
		ifneq ($(filter %86,$(UNAME_P)),)
	OSFLAG += -D IA32
		endif
	ifneq ($(filter arm%,$(UNAME_P)),)
		OSFLAG += -D ARM
	endif
endif

# @targets
# make all
# make clean
# make linux
# make linux-arm64
# make windows
# make windows-arm64
# make releaf
# make unreleaf
# make help
# make test


all: guess
link:
	$(NPM) typescript @types/node pkg
	$(TSC) *.ts
guess: link
	$(CC) $(MAIN).js -o $(MAIN)
	$(CC) $(AUX_PKG_MANAGER).js -o $(AUX_PKG_MANAGER)


linux: link
	$(CC) -t node14-linux $(MAIN).js -o $(MAIN)	
linux-arm64: link
	$(CC) -t node14-linux-arm64 $(MAIN).js -o $(MAIN)

windows: link
	$(CC) -t node14-win $(MAIN).js -o $(MAIN)
windows-arm64: link
	$(CC) -t node14-win-arm64 $(MAIN).js -o $(MAIN)


releaf:
	npm install --save-dev typescript @types/node
	npx tsc *.ts
	cp -Rfv *.js build/luna/
	chmod +x build/lunac build/lpm 
	cp -Rfv build/* /usr/local/bin/
	cp -Rfv node_modules /usr/local/bin/luna/node_modules

unreleaf:
	rm -Rfv /usr/local/bin/luna
	rm -Rfv /usr/local/bin/lunac
	rm -Rfv /usr/local/bin/lpm

clean:
ifeq ($(OSFLAG), WIN32)
	del /f *.js
else
	rm -Rf *.js build/luna/*js
endif


help:
	$(CC) -help
test:
ifeq ($(OSFLAG), WIN32)
	start $(MAIN) --version
else
	./$(MAIN) --version
endif
