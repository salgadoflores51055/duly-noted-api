import { promises as fs } from 'fs';

export const saveNotes = async (notes) => {
  if (!Array.isArray(notes)) {
    throw new Error('Notes argument must be an array');
  }
  await fs.writeFile('./data.json', JSON.stringify(notes, null, ' '));
};

export const getNotes = async () => {
  let notesJSON;

  try {
    notesJSON = await fs.readFile('./data.json', 'utf-8');
  } catch (error) {}

  return notesJSON ? JSON.parse(notesJSON) : [];
};

