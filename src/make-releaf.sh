#!/bin/bash
npm install --save-dev

npx tsc lex.ts
cp -Rfv lex.js build/luna/lex.js

npx tsc os.ts
cp -Rfv os.js build/luna/os.js

npx tsc class_def.ts
cp -Rfv class_def.js build/luna/class_def.js

npx tsc lunac.ts
cp -Rfv lunac.js build/luna/lunac.js
 
npx tsc lpm.ts
cp -Rfv lpm.js build/luna/lpm.js

chmod +x build/lunac.js build/lpm.js
cp -Rfv build/* /usr/local/bin/
cp -Rfv node_modules /usr/local/bin/luna/node_modules
