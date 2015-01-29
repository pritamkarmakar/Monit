# Monit
Webpage, webservice monitoring application. Technology stack - node.js, mongodb

## Getting Started
#### Configure MongoDB:
1. Install Mongodb: from http://www.mongodb.org/
2. Start Mongodb:
Open command prompt as an admin and run below script
```bash
cd $<mongodb dir>\bin
mongod --dbpath $"<mongodb dir>\data"
```

#### Start Monit:
1.Open another command line instance and run below command

```bash
cd $<monit source code directory>\bin
node www
```
2.Open browser and navigate to http://localhost:3000

#### Screenshots:
This is how the dashboard will look like -
![ScreenShot](https://raw.githubusercontent.com/pritamkarmakar/monit/master/public/img/dashboard.PNG)
Add a new webpage for monitoring -
![ScreenShot](https://raw.githubusercontent.com/pritamkarmakar/monit/master/public/img/addnewpage.PNG)
