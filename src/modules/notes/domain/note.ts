export type Note = {
  id: string;
  title: string;
  user_id: string;
  text: string;
  created_at: string;
};

export type NoteInsertData = {
  title: string;
  user_id: string;
  text: string;
};

export type NoteUpdateData = {
  title: string;
  text: string;
};
