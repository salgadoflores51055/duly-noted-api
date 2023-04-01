import cuid from "cuid";

const savedNotes = [];

export default {
  Mutation: {
    createNote(_, args) {
      const { note } = args;

      const newNote = { ...note };

      if (!newNote.id) {
        newNote.id = cuid();
      }

      if (!newNote.createdAt) {
        const now = new Date();
        newNote.createdAt = now.toISOString();
      }

      if (!newNote.updateAt) {
        const now = new Date();
        newNote.updatedAt = now.toISOString();
      }

      if (typeof newNote.isArchived !== "boolean") {
        newNote.isArchived = false;
      }

      savedNotes.push(newNote);
      return newNote;
    },
    // Update note 
    updateNote(_, args) {
      const { id, note } = args;

      const noteUpdate = savedNotes.find((savedNote) => savedNote.id === id);
      if (!noteUpdate) {
        throw new Error('Note with ID ${id} not found');
      }

      const updateNote = { ...note };

      if (typeof updateNote.isArchived === "boolean" || typeof updateNote.text === "string") {
        updateNote.updatedAt = (new Date()).toISOString();
      } else {
        return noteUpdate;
      }

      let updatedNote;
      for (let i = 0; i < savedNotes.length; i++) {
        if (savedNotes[i].id === id) {
          Object.assign(savedNotes[i], updateNote);
          updatedNote = savedNotes[i];
          break;
        }
      }

      return updatedNote;
    },

    // DELETE NOTE

    deleteNote(_, args) {
      const { id } = args;

      let deleteNote;
      for (let i = 0; i < savedNotes.length; i++) {
        if (savedNotes[i].id === id) {
          deleteNote = savedNotes.splice(i, 1)[0];
          break;
        }
      }
      if (!deleteNote) throw new Error(`Note with ID ${id} not found`);
      return deleteNote;

    }


  },
  Query: {
    note(_, args) {
      return savedNotes.find((note) => note.id === args.id);
    },

    notes(_, args) {
      const { includeArchived } = args;
      if (includeArchived) {
        return savedNotes;
      }

      return savedNotes.filter((note) => !note.isArchived);
    }
  }
};