# webadvanced_  POUR RENTRER ENTANT QU'ADMINISTRATEUR: CREER UN COMPTE AVEC LE NOM admin   

#Do line breaks(saut de ligne) in README.md file:  
just do double space  

#GIT !  
voir ce qu'on a changé dans des fichiers:  
$git diff

voir derniers commits par colaborateurs:  
$git log  



#I strongly recommend to restart npm modules when cloning of copying the projet for the first time:   

$ npm cache clean --force  
$ rm -rf node_modules package-lock.json  
$ npm install  
$ npm star  


#install react dans le pc  
$ npm install -g create-react-app  


#create an app in react:  
$ create-react-app *nom_de_l_app  

#lancer  
$ npm start  

#solve bcrypt bug for api folder:  
npm rebuild bcrypt --build-from-source  

#bug too many watchers:  
When you see this notification, it indicates that the VS Code file watcher is running out of handles because the workspace is large and contains many files. The current limit can be viewed by running:  

cat /proc/sys/fs/inotify/max_user_watches  

The limit can be increased to its maximum by editing /etc/sysctl.conf and adding this line to the end of the file:  

fs.inotify.max_user_watches=524288  

The new value can then be loaded in by running:  
$sudo sysctl -p  

###kill port occupé  
$sudo netstat -lnp|grep 8000
$kill -9 PORT_NUMBER