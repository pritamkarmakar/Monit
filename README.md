

# Monit



## Usage
Start MongoDB: 
cd c:\mongodb\bin
.\mongod --dbpath "c:\mongodb\data"

To start the application
cd C:\Users\PKARMAKA\workspace\Monit\bin
node www


Query to mongodb
cd c:\mongodb\bin
mongo
show dbs /* to see all available databases */
use <databasename>
db.webpages.find().pretty() --> to see all the records inside webpages collection
db.webpages.update({name:'HOLA'}, {url:'www.google.com', name: 'HOLA', interval: '00:16:10'} --> update a specific record

## Developing



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.


#### Debug Node js application
install node-inspector globally (npm install -g node-inspector)
from a command-line window, run: node-inspector. If you get any error like 'Cannot start the server at 0.0.0.0:8080. Error: listen EACCES' try this option node-inspector -p 8090 (or other port)
open Chrome and go to http://localhost:8090/debug?port=5858. You'll get the node-inspector UI but without any running app.
from another command-line window, run your app with the --debug switch like this: node --debug bin\www
refresh the Chrome tab and voila! Use --debug-brk to break at the begining

https://greenido.wordpress.com/2013/08/27/debug-nodejs-like-a-pro/