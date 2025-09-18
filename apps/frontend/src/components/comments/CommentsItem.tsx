import { useState } from 'react';
import { Comment } from './CommentInput'; // Assuming Comment type is exported from CommentInput
import CommentInput from './CommentInput';

const CommentsItem = ({
  comment,
  onUpdateComments,
}: {
  comment: Comment;
  onUpdateComments: (updatedComments: Comment[]) => void;
}) => {
  const [reply, setReply] = useState(false);
  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid #eee', paddingLeft: '10px' }}>
      <p>{comment.content}</p>
      <div>
        {reply && (
          <CommentInput
            handleAddComment={(e) => onUpdateComments([...comment.children, e])}
          />
        )}
        <button onClick={() => setReply(!reply)}>
          {reply ? 'Cancel' : 'Reply'}
        </button>
      </div>
      <div>
        {comment.children.map((child, index) => (
          <CommentsItem
            key={index}
            comment={child}
            onUpdateComments={(updatedComments) => {
              const updatedChildren = [...comment.children];
              updatedChildren[index] = { ...child, children: updatedComments };
              onUpdateComments(updatedChildren);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsItem;