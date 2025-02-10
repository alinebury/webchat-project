import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from "socket.io"
import url from 'url'

import './db.js'
import { collectionDocuments } from './db.js'

const documents = [
  { name: "JavaScript", text: "Texto de JavaScript"},
  { name: "Node", text: "Texto de Node"},
  { name: "Socket.io", text: "Texto de Socket.io"}
];

async function atualizarDoc(name, text) {
  const atualizado = await collectionDocuments.updateOne({ 
    name,
  }, {
    $set: { text }
  })

  return atualizado
}

const encontrardocumento = async (name) => {
  return collectionDocuments.findOne({ name });
};

const app = express();
const port = process.env.PORT || 3000;


const currentPath = url.fileURLToPath(import.meta.url);
const frontend = path.join(currentPath, "../..",'frontend');

app.use(express.static(frontend));

const serverHttp = http.createServer(app);
serverHttp.listen(port, () => console.log(`listening on port ${port}`));

const io = new Server(serverHttp);

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('selecionar_documento', async (name, callback) => {
    socket.join(name);

    const documento = await encontrardocumento(name)
    if (documento) {
      // socket.emit("texto_documento", documento.text);
      callback(documento.text);
    }
  });

  socket.on('text_editor', async (msg, documentoName) => {
    // socket.broadcast.emit('text_editor', msg);
    const documento = await atualizarDoc(documentoName, msg)

    if(documento) {
      documento.text = msg;
    }
    socket.to(documentoName).emit("text_editor", msg)
  });
});

