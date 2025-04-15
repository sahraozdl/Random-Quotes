import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";

const defaultAvatar = "../default-avatar.jpg";

export const Settings = () => {
  const {user} = useContext(UserContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(
    user.favoriteCategories || []
  );
  const [categories, setCategories] = useState([]); // State to hold categories

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoryList = [];
      querySnapshot.forEach((doc) => {
        categoryList.push(doc.id); // Assuming each document ID is the category name
      });
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((category) => category !== value)
        : [...prevCategories, value]
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
        setPhotoURL(data.photoURL || "");
        setPreviewImage(data.photoURL || "");
        setSelectedCategories(data.favoriteCategories || []);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user?.id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setPhotoURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", user.id);
      const docSnapshot = await getDoc(userRef);
      if (!docSnapshot.exists()) {
        await setDoc(userRef, { name: "", phone: "", photoURL: "" });
        console.log("New user document created with default fields.");
      }

      let imageURL = previewImage;

      if (photoURL instanceof File) {
        const storageRef = ref(storage, `avatars/${user.id}/${photoURL.name}`);

        const uploadResult = await uploadBytes(storageRef, photoURL);
        console.log("Upload result:", uploadResult);

        imageURL = await getDownloadURL(uploadResult.ref);
        console.log("Download URL:", imageURL);
      }

      await setDoc(
        userRef,
        {
          name,
          phone,
          photoURL: imageURL,
          favoriteCategories: selectedCategories,
        },
        { merge: true }
      );
      alert("Profile updated!");

      console.log("User document updated with name:", name);
    } catch (error) {
      console.error("Error in handleSave function:", error.message);
      alert("Something went wrong. Check the console for more details.");
    }
  };

  if (loading) return <p>Loading user settings...</p>;

  return (
    <section class="container ">
      <h2 class="text-2xl font-bold">Account Settings</h2>

      <div class="inner-container">
        {previewImage && (
          <img
            src={previewImage}
            alt="User avatar"
            class="w-20 h-20 rounded-full m-0 p-0"
          />
        )}

        <div className="flex flex-col text-left decoration-none">
          <label>
            <strong class="block">Username:</strong>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="user-page__input"
              placeholder="Enter your name"
            />
          </label>

          <label>
            <strong class="block">Phone:</strong>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="user-page__input"
              placeholder="Enter your phone number"
            />
          </label>

          <label>
            <strong class="block">Upload Profile Picture:</strong>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="user-page__input"
            />
          </label>

          <label>
            <strong class="block">Favorite Categories:</strong>
            <select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              className="user-page__input user-page__select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <button onClick={handleSave} class="btn-yellow">
            Save Settings
          </button>
        </div>
      </div>
    </section>
  );
};
export default Settings;