import mongoose from "mongoose";
const Schema = mongoose.Schema;


// {
//   "userName": "Гульнара",
//   "projects": [],
//   "email": "test@test.test",
//   "password": "123",
//   "isBlocked": false,
//   "isConfirm": false  
// }

const validateEmail = function(email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
  
// установка схемы для создания пользователя

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isConfirm: { type: Boolean, default: false },
});

// установка схемы для создания задачи

const taskSchema = new Schema({ 
  taskId: { type: String, required: true },
  taskName: { type: String, required: true },
  flag: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isDone: { type: Boolean, default: false },
}, { _id : false })

// установка схемы для создания проекта

const projectSchema = new Schema({
    userId: Schema.Types.ObjectId,
    projectName: { type: String, required: true },
    tasks: [ taskSchema ]
})
  
// подключение к базе данных МонгоДБ через клиентскую библиотеку Монгус 
mongoose.connect("mongodb://127.0.0.1:27017/to-do-list", { useUnifiedTopology: true, useNewUrlParser: true }).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});
  
export const User = mongoose.model("User", userSchema);
export const Project = mongoose.model("Project", projectSchema);

// User.find({}, function(err, docs){
//  // mongoose.disconnect();
   
//   if(err) return console.log(err);
   
//   console.log('Документы');
//   console.log(docs);
// });

export default mongoose