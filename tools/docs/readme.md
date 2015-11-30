Documentation Generator
=======================

Generation Documentation
-----------------------
Go to the tools/build dir and run

    npm install

then run the grunt command

    grunt docs

Docs have been generated in the root/docs folder.

Documentation Server
-----------------------
start documentation server for quick checking of your docs.

first install yuidocs global through npm

    npm install -g yuidocjs

go to the dir you want to have parsed and run this command

    yuidoc --server -e ".ts" *

It will run a documentation server on port :3000 on your localhost

docs are awesome.

Using IntelliJ's Run/Debug tool for launching YUIDoc
----------------------------------------------------
You can use IntelliJ's built in Run/Debug tool to easily launch the YUIDoc webserver. To configure it, open the
Run/Debug dialog (usually in the upper right corner, a dropdown next to a play button) and follow these steps:

1. In the treelist on the left click the + and select Node.js from the dropdown
2. In the name field, enter `YUI Doc Runner` (or whatever you want to call it)
3. If the field "Node interpreter" is not filled, enter the path to your node binary
4. In the "Working directory" field enter the path to the deploy folder of your gaia-skeleton folder
5. Find the path to YUIDoc's cli.js (for me it was `C:\Users\stuart\AppData\Roaming\npm\node_modules\yuidocjs\lib\cli.js`)
and enter it in the "JavaScript file" field
6. In the "Applications parameters" field enter `--server -e ".ts" *`

Additionally, IntelliJ can automatically launch your browser and open the running documentation server.

1. Click on the "Browser / Live Edit" tab and check the "After launch" checkbox
2. Enter `http://localhost:3000/` in the field below