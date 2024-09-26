require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// a route to recieve requests (from Frontend/react..) and respond back with About Us data (mimics by hardcoding json data here)
app.get('/about-us', async (req, res) => {
  try {
    res.status(200).json({
      title: "About Us",
      description: `Hi! I'm Anthony! I’m a senior at NYU studying Computer Science. I’ve always loved tech and have a big \
interest in backend development and large-scale systems. Lately, I’ve been getting into front-end and full-stack \
development, which I’m honestly really enjoying :)

I grew up in Los Angeles with a Mexican background, which has definitely influenced my love for cooking, sports, and \
discovering new places/cultures. One of the best parts of my college experience was studying abroad in Florence—loved \
the Italian architecture and culture (and the food was crazy good & cheap!). I also enjoy traveling, cooking, 3D art, \
gaming, dog walking, and exploring new hobbies!

More on the tech side, I’ve had the chance to work on some cool projects, such as interning at LinkedIn, where I worked \
on scaling infrastructure systems, and at Liberty Mutual, focusing on performance optimization software. I’m excited to \
keep gaining new experiences and learning (such as JS & full-stack dev), especially in hands-on classes like this!`,
      imageURL: "https://i.postimg.cc/br5vWP49/IMG-2192.jpg"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to the load about-us content',
      status: 'error'
    });
  }
});

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
