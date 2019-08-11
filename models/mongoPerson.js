const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI;
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
console.log('Connecting to MongoDB', mongoUrl);

mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(result => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB: ', error.message));

let personSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    match: /\d{8,}/,
  },
});
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});


module.exports = mongoose.model('Person', personSchema);
