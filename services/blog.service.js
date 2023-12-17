const {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  query,
  limit,
  orderBy,
  startAfter,
  doc,
} = require("firebase/firestore");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const db = getFirestore();
const storage = getStorage();

const blogCollection = collection(db, "Blogs");

const blog_size = 1; // Number of documents to fetch per page
let lastVisibleDoc = null;

const readBlog = async () => {
  let blogQuery;

  if (lastVisibleDoc) {
    blogQuery = query(
      blogCollection,
      limit(blog_size),
      orderBy("dateCreated", "desc"),
      startAfter(lastVisibleDoc)
    );
  } else {
    blogQuery = query(
      blogCollection,
      limit(blog_size),
      orderBy("dateCreated", "desc")
    );
  }

  const data = [];

  // Perform snapshots to fetch data 1 by 1
  const querySnapshot = await getDocs(blogQuery);
  querySnapshot.forEach((doc) => {
    const blogData = doc.data();
    const blogId = doc.id;

    blogData.id = blogId;
    data.push(blogData);
  });

  // Check if data fetched is still available to loop the post
  if (querySnapshot.docs.length >= blog_size)
    lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  else lastVisibleDoc = null;

  return data;
};

const addBlog = async (data) => {
  const { image } = data;
  const storageRef = ref(storage, image.originalname, image.mimetype);
  const metadata = {
    contentType: image.mimetype,
  };
  const uploadTask = uploadBytesResumable(storageRef, image.buffer, metadata);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const uploaded = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(uploaded);
    },
    (error) => {
      console.log(error);
    },
    async () => {
      imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      const newData = {
        ...data,
        image: imageUrl,
      };

      return await addDoc(blogCollection, newData);
    }
  );
  lastVisibleDoc = null;
  console.log("New blog post is successfully uploaded");
};

const updateBlogById = async (id, data) => {
  const docRef = doc(blogCollection, id);
  return await updateDoc(docRef, data);
};

const getBlogById = async (id) => {
  const docRef = doc(blogCollection, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Blog with ID does not exist!");

  return docSnap.data();
};

module.exports = { addBlog, readBlog, getBlogById, updateBlogById };
