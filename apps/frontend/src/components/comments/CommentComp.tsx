import { useState } from 'react';
import CommentInput, { Comment } from './CommentInput';
import CommentsItem from './CommentsItem';

const CommentComp = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddComment = (comment: Comment) => {
    setComments((prevComments) => [...prevComments, comment]);
  };

  return (
    <main>
      <div>
        <CommentInput handleAddComment={handleAddComment} />

        <div>
          {comments.map((comment, index) => (
            <CommentsItem
              key={index}
              comment={comment}
              onUpdateComments={(updatedComments) => {
                const updatedCommentsArray = [...comments];
                updatedCommentsArray[index].children = updatedComments;
                setComments(updatedCommentsArray);
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CommentComp;