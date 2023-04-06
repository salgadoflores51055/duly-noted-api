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

      if (!newNote.updatedAt) {
        const now = new Date();
        newNote.updatedAt = now.toISOString();
      }

      if (typeof newNote.isArchived !== "boolean") {
        newNote.isArchived = false;
      }

      savedNotes.push(newNote);

      return newNote;
    },
    updateNote(_, args) {
      const { id, note } = args;

      const noteToUpdate = savedNotes.find((savedNote) => savedNote.id === id);
      if (!noteToUpdate) {
        throw new Error(`Could not find note to update with ID ${id}`);
      }

      const noteUpdates = { ...note };

      if (typeof noteUpdates.isArchived === "boolean" || typeof noteUpdates.text === "string") {
        const now = new Date();
        noteUpdates.updatedAt = now.toISOString();
      } else {
        // No changes needed
        return noteToUpdate;
      }

      let updatedNote;
      for (const savedNote of savedNotes) {
        if (savedNote.id === id) {
          Object.assign(savedNote, noteUpdates);
          updatedNote = savedNote;
          break;
        }
      }

      return updatedNote;
    },
    deleteNote(_, args) {
      const { id } = args;

      const noteIndex = savedNotes.findIndex((savedNote) => savedNote.id === id);
      if (noteIndex < 0) {
        throw new Error(`Could not find note to update with ID ${id}`);
      }

      const [removedNote] = savedNotes.splice(noteIndex, 1);

      return removedNote;
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