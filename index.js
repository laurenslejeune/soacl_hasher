//Load modules with `require` directive
var express = require('express');
var app = express();
var cors = require('cors')
const crypto = require('crypto');
var path = require('path');

//Dealing with CORS:
app.use(cors())

//Transform an input to a hash
function inputToHash(algorithm,input)
{
  //By taking random numbers, ensure that the hash value cannot be cracked (for example by sending inputs until the same value has been reached).
  const secret = Math.floor(Math.random() * 10000) + "ik ben een aap en ik eet graag kokosnoten123" + Math.floor(Math.random() * 10000);
  return crypto.createHmac(algorithm, secret).update(input).digest('hex');
}

//Define request response in root URL (/)
app.get('/', function (req, res) 
{
  res.redirect('./documentation');
})

//Show documentation
app.get('/documentation', function (req, res) 
{
  res.sendFile(path.join(__dirname + '/index.html'));
})

//Apply hashing
app.get('/hash/:algorithm/:value', function (req, res) 
{
  let input = req.params.value;
  let algorithm = req.params.algorithm;

  if(crypto.getHashes().indexOf(algorithm) > -1)
  {
    res.send({algorithm: algorithm, input:input, output: inputToHash(algorithm,input)});
  }
  else
  {
    res.send("Invalid hashing algorithm. Please check the list of available algorithms in case of doubt.");
  }
})

//Show possible algorithms
app.get('/hash/algorithms', function (req, res) 
{
  res.send(crypto.getHashes());
})

//Launch listening server on port 80
app.listen(80, function () 
{
  console.log('app listening on port 80')
})