const socket = io();
const params = new URLSearchParams(window.location.search);
const documentName = params.get("nome")
const documentTitle = document.getElementById("titulo-documento");

documentTitle.textContent = documentName || "Documento sem titulo"


const textEditor = document.getElementById("editor-texto");
textEditor?.addEventListener("keyup", () => {
  socket.emit("text_editor", textEditor.value, documentName);
});

socket.emit('selecionar_documento', documentName, (texto) => {
  textEditor.value = texto;
})

socket.on("text_editor", (msg) => {
  textEditor.value = msg;
});

socket.on("texto_documento", (texto) => {
  textEditor.value = texto;
})
