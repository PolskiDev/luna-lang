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

clean:
ifeq ($(OSFLAG), WIN32)
	del /f *.js
else
	rm -Rf *.js
endif


help:
	$(CC) -help
test:
ifeq ($(OSFLAG), WIN32)
	start $(MAIN) --version
else
	./$(MAIN) --version
endif
