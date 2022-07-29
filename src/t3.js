// import { MongoClient } from 'mongodb';

// Connection URL
// const url = "mongodb://localhost:27017";
// const client = new MongoClient(url);

// Database Name
// const dbName = 'to-do-list';

// async function main() {
    // Use connect method to connect to the server
    // await client.connect();
    // console.log('Connected successfully to server');
    // const db = client.db(dbName);
    // const collection = db.collection('users');
  
    // collection.insertOne({"firstName": "Alex", num: 12})
  
    // collection.findOne({}, function(err, result){
    //   if (err) throw err;
    //   console.log(result);
    // });
  
    // let users = collection.find({}).toArray(function(err, result){
    //     if (err) throw err;
    //     console.log(result);
    // });
  
  
    // collection.updateOne({num: 10}, { $set: {test: 15} },function(err, result){
    //   if (err) throw err;
    //   console.log("1 document updated");    
    // });
  
    // collection.deleteOne({}, function(err, result){
    //   if (err) throw err;
    //   console.log("1 document deleted");
    // });
  
    // collection.deleteMany({}, function(err, result){
    //   if (err) throw err;
    //   console.log("All documents deleted");
    // });
  
//     return 'done.';
//   }
  
//   main().then(console.log).catch(console.error)
//    // .finally(() => client.close());

// export default client