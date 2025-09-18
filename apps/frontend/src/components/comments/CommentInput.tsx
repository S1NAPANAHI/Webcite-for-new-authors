import { FormEvent } from 'react';

export type Comment = {
  content: string;
  children: Comment[];
};

const CommentInput = ({
  handleAddComment,
}: {
  handleAddComment: (comment: Comment) => void;
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const comment = formData.get('comment') as string;
    if (!comment || comment.trim() === '') return alert('Comment is required');

    handleAddComment({ content: comment, children: [] });
    e.currentTarget.reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="comment" placeholder="Add comment" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentInput;