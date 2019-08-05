const mongoose = require('mongoose')
const mongoUrl = process.env.MONGODB_URI
mongoose.set('useFindAndModify',false);
console.log('Connecting to MongoDB',mongoUrl );

mongoose
.connect(mongoUrl,{useNewUrlParser:true})
.then(result=>console.log('Connected to MongoDB'))
.catch(error=>console.log('Error connecting to MongoDB: ',error.message))

var personSchema = mongoose.Schema({
    name:String,
    number:String
}) 

personSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})


module.exports = mongoose.model('Person',personSchema);