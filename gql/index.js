const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/graphql",
{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.Promise=global.Promise

const UserModel=require("./models/user")

let schema = buildSchema(`
    type Query{
            user(id:String!):User
    }

    type Mutation{


      registerUser(name:String!,email:String!,password:String!):User
      loginUser(email:String!,password:String!):User
    }

    type Token{
      token:String!
    }

    type User{
        name:String,
        id:String,
        password:String,
        age:Int,
        email:String,
        admin:Boolean
    }
    
    `);


let resolver = {
  user: async(args) => {
  let user= await UserModel.findById(args.id)
  if(user==null) throw "its null data"
    return user ;
  },
  registerUser:async({name,email,password})=>{
    try{var user=await UserModel.create({
      name,
      email,
      password:UserModel.hashPassword(password)
    })}
    catch(err){
      throw "invalid info"
    }
    return UserModel.findOne({email:user.email})


  },
  loginUser:async({email,password})=>{
    let user =await UserModel.findOne({email:email})
    if(!user){
      throw "user not found"
    }
    let isvalid=user.comparePassword(password);
    if(!isvalid){
      throw "password is invalid"
    }
    return UserModel.findOne({_id:user.id})
  }
};


app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
  })
);



app.listen(3000, () => {
    console.log("listening for request!");
});