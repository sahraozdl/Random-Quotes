import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import "./index.css";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";

export const Settings = () => {
  const user = useContext(UserContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load user data from Firestore
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
      // Reference to the Firestore user document
      const userRef = doc(db, "users", user.id);

      // Check if the document exists, if not create it with default values
      const docSnapshot = await getDoc(userRef);
      if (!docSnapshot.exists()) {
        // If the document doesn't exist, create it with default fields
        await setDoc(userRef, { name: "", phone: "", photoURL: "" });
        console.log("New user document created with default fields.");
      }

      let imageURL = previewImage;

      // Check if photoURL is an instance of File (i.e., a new image is being uploaded)
      if (photoURL instanceof File) {
        // Create a reference to Firebase Storage
        const storageRef = ref(storage, `avatars/${user.id}/${photoURL.name}`);

        // Upload the image to Firebase Storage
        const uploadResult = await uploadBytes(storageRef, photoURL);
        console.log("Upload result:", uploadResult);

        // Get the download URL for the uploaded image
        imageURL = await getDownloadURL(uploadResult.ref);
        console.log("Download URL:", imageURL);
      }

      // Save the updated user data to Firestore
      await setDoc(
        userRef,
        {
          name,
          phone,
          photoURL: imageURL,
        },
        { merge: true }
      );

      // Alert the user that their profile was updated
      alert("Profile updated!");

      // Log the update to the console for debugging
      console.log("User document updated with name:", name);
    } catch (error) {
      // Log the specific error details for debugging
      console.error("Error in handleSave function:", error.message);
      alert("Something went wrong. Check the console for more details.");
    }
  };

  if (loading) return <p>Loading user settings...</p>;

  return (
    <section className="user-page user-page__settings">
      <h2 className="user-page__heading">Account Settings</h2>

      <div className="user-page__card">
        {previewImage && (
          <img
            src={previewImage}
            alt="User avatar"
            className="user-page__avatar"
          />
        )}

        <div className="user-page__details">
          <label>
            <strong>Username:</strong>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="user-page__input"
              placeholder="Enter your name"
            />
          </label>

          <label>
            <strong>Phone:</strong>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="user-page__input"
              placeholder="Enter your phone number"
            />
          </label>

          <label>
            <strong>Upload Profile Picture:</strong>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="user-page__input"
            />
          </label>

          <button onClick={handleSave} className="user-page__button">
            Save Settings
          </button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
