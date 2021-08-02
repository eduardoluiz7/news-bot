const firebase =  require('firebase');
var bodyParser = require('body-parser');
const express = require("express");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig)

let database =  firebase.database();

app.use(express.static("public"));

// get news from database
function getData(){
  var noticiaRef = database.ref('noticias');
  noticiaRef.once('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data)
    const firebaseNoticias = data? data : {};

    const parsedNoticias = Object.entries(firebaseNoticias).map(([key, value]) => {
        return {
            id: key,
            titulo: value.titulo,
            descricao: value.descricao,
            urlImage: value.urlImage,
            link: value.link,
            tema: value.tema
        }
    });
    console.log(parsedNoticias);
    return parsedNoticias;
});
  
};


app.post("/newsbot", (request, response) => {
  let tema = request.body.queryResult['queryText'];
  const dbRef = firebase.database().ref();
  dbRef.child("noticias").get().then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    const firebaseNoticias = data? data : {};

    let parsedNoticias = Object.entries(firebaseNoticias).map(([key, value]) => {
        return {
            id: key,
            titulo: value.titulo,
            descricao: value.descricao,
            urlImage: value.urlImage,
            link: value.link,
            tema: value.tema
        }
    });
    
    parsedNoticias = parsedNoticias.filter(noticia => noticia.tema === tema)
    
    let modelosGenericos = parsedNoticias.map((noti)=>{
      return {
                "title": noti.titulo,
                "image_url":noti.urlImage,
                "subtitle":noti.descricao,
                "buttons":[{
                      "type":"web_url",
                      "url":noti.link,
                      "title":"View Website"
                      }
                ]      
              }
    });
    
    if(modelosGenericos.length > 0){
      response.json({fulfillmentMessages: [{ 
      payload: {
        "facebook": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
               "elements": modelosGenericos.slice(0, 10)
            }
          }
        }
    },
      platform: "FACEBOOK"
    }]});  
    }else{
      response.json({"fulfillmentMessages": [
    {
      "quickReplies": {
        "title": "Desculpe, não possuimos notícias sobre este tema. Escolha outro tópico",
        "quickReplies": [
          "Entretenimento",
          "Política",
          "Esportes",
          "Famosos"
        ]
      },
      "platform": "FACEBOOK"
    },
    {
      "text": {
        "text": [
          "Desculpe, não possuimos notícias sobre este tema. Escolha outro tópico"
        ]
      }
    }
  ]});  
    }
    
    
  } else {
    response.json({fulfillmentText: "Ocorreu um erro, tente mais tarde"});
    }
  }).catch((error) => {
  console.error(error);
    response.json({fulfillmentText: "erro"});
  });
  
});



// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
