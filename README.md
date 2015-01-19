# Monit

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/pritamkarmakar/Monit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
webpage, webservice monitoring application

## Getting Started
#### Start MongoDB:
```bash
cd $<mongodb dir>\bin
.\mongod --dbpath $"<mongodb dir>\data"
```

#### Start Application
```bash
cd $<application dir>\bin
node www
```

#### Query to mongodb
```bash
cd $<mongodb dir>\bin
mongo
show dbs /* to see all available databases */
use <databasename>
db.webpages.find().pretty() /* to see all the records inside webpages collection */ 
db.webpages.update({name:'HOLA'}, {url:'www.google.com', name: 'HOLA', interval: '00:16:10'} /* update a specific record */
```


#### Debug Node js application
* install node-inspector globally (npm install -g node-inspector)
* From a command-line window, run: node-inspector. If you get any error like 'Cannot start the server at 0.0.0.0:8080. Error: listen EACCES' try this option node-inspector -p 8090 (or other port)
* Start the node.js app with "node --debug-brk bin/www" [-brk will stop the app in the first line]
* open Chrome and go to http://localhost:8090/debug?port=5858. You'll get the node-inspector UI but without any running app.
* from another command-line window, run your app with the --debug switch like this: node --debug bin\www
* refresh the Chrome tab and voila! Use --debug-brk to break at the begining

Details [here](https://greenido.wordpress.com/2013/08/27/debug-nodejs-like-a-pro/)

#### External Tools used:
1. Nodemon - https://github.com/remy/nodemon [keep track of any server change and restart the server, perfect for development]
2. Node-Inspector - https://github.com/node-inspector/node-inspector [for debugging]

