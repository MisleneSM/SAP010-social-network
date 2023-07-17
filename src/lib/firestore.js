import {
  collection,
  doc,
  query,
  addDoc,
  setDoc,
  orderBy,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../Firebase/instalfirebase';

// função que atualiza a página do feed com base nas postagens e nos likes recebidos.
const updateUI = (render, feedItems, likes) => {
  const items = feedItems.map((item) => ({
    ...item,
    likes: likes.filter(({ postId }) => postId === item.id),

  }));
  render(items);
};

// função para buscar os itens dos post's e likes
export const getFeedItems = (renderItems) => {
  let feedItems = [];
  let likes = [];

  // função para buscar os post's
  const feedPost = collection(db, 'Post');
  const q = query(feedPost, orderBy('createdAt', 'desc'));

  // carrega os post's sem recarregar a página
  onSnapshot(q, (querySnapshot) => {
    feedItems = [];

    querySnapshot.forEach((itemDoc) => {
      const item = {
        id: itemDoc.id,
        ...itemDoc.data(),
      };

      feedItems.push(item);
    });

    updateUI(renderItems, feedItems, likes);
  });

  // função para buscar os likes
  const postLikes = collection(db, 'PostLikes');
  const q2 = query(postLikes);
  onSnapshot(q2, (querySnapshot) => {
    likes = [];

    querySnapshot.forEach((itemDoc) => {
      const item = {
        id: itemDoc.id,
        ...itemDoc.data(),
      };

      likes.push(item);
    });

    updateUI(renderItems, feedItems, likes);
  });
};

export const publish = async (post) => {
  await addDoc(collection(db, 'Post'), post);
};

export const editItem = async (id, post) => {
  const refDoc = doc(db, 'Post', id);
  await setDoc(refDoc, post);
};

export const like = async (postId, userId) => {
  await setDoc(doc(db, 'PostLikes', `${postId}_${userId}`), { postId, userId });
};

export const dislike = async (postId, userId) => {
  await deleteDoc(doc(db, 'PostLikes', `${postId}_${userId}`));
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'Post', postId));
};
