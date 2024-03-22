const { nanoid } = require('nanoid');
const notes = require('./notes');

//ADD
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = {
  	title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};


//GET ALL NOTES
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});


// GET DETAIL
const getNotesByIdHandler = (request, h)=>{
  const { id } = request.params;
  const note = notes.filter((n)=>n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  return h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  }).code(404);
}

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
 
  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) {
    return h.response({
      success: 'fail',
      message: 'Update gagal, id tidak ditemukan'
    }).code(404);
  }

  notes[index] = {
  	...notes[index],title, tags, body, id, updatedAt,
  }
  return {
    status: 'success',
    message: 'Catatan berhasil diperbarui',
  };
};

const deleteNoteByIdHandler = (request,h)=>{
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return h.response({
      success: 'fail',
      message: 'Id tidak ditemukan'
    }).code(404);
  }

  notes.splice(index,1);
  return {
    status: 'success',
    message: 'Catatan berhasil dihapus',
  };
}

module.exports = { addNoteHandler, getAllNotesHandler , getNotesByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};
