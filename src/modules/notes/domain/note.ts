export type Note = {
  id: string;
  title: string;
  user_id: string;
  text: string;
  created_at: string;
}

export type NoteInsertData = {
  title: string;
  user_id: string;
  text: string;
}