import API from './axios';

export const createPost = async (postData) => {
  const response = await API.post('/posts/createpost', postData);
  return response.data;
};

export const getPosts = async () => {
  const response = await API.get('/posts/getpost');
  return response.data;
};

export const likePost = async (postId) => {
  const response = await API.post(`/posts/likepost/${postId}/like`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await API.post(`/posts/comment/${postId}/comment`, { content });
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await API.delete(`/posts/deletepost/${postId}`);
  return response.data;
};
