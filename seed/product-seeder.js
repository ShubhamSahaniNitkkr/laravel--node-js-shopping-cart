var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping',{ useNewUrlParser: true });


var products = [
      new Product({
      imagePath:'https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg',
      title:'XBOX 400E',
      description:'Xbox is a video gaming brand created and owned by Microsoft of the United States. It represents a series of video game consoles developed by Microsoft.Experience a new generation of games and entertainment with Xbox. The best games and entertainment on all of your devices.',
      price:20030
      }),

      new Product({
      imagePath:'https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg',
      title:'XBOX 600T',
      description:'Xbox is a video gaming brand created and owned by Microsoft of the United States. It represents a series of video game consoles developed by Microsoft.Experience a new generation of games and entertainment with Xbox. The best games and entertainment on all of your devices.',
      price:35000
      }),

      new Product({
      imagePath:'https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg',
      title:'XBOX 000F',
      description:'Xbox is a video gaming brand created and owned by Microsoft of the United States. It represents a series of video game consoles developed by Microsoft.Experience a new generation of games and entertainment with Xbox. The best games and entertainment on all of your devices.',
      price:30000
      }),

      new Product({
      imagePath:'https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg',
      title:'XBOX 00ET',
      description:'Xbox is a video gaming brand created and owned by Microsoft of the United States. It represents a series of video game consoles developed by Microsoft.Experience a new generation of games and entertainment with Xbox. The best games and entertainment on all of your devices.',
      price:10030
      }),
];

var done=0;
for(var i= 0;i<products.length;i++){
  products[i].save(function(err,result){
    done++;
    if(done=== products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
