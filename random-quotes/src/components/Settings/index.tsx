import { useContext, useState, useEffect } from "react";
import { UserContext,User} from "../../UserContext";
import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { Button } from "../Button";

const defaultAvatar = "../default-avatar.jpg";

export const Settings = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    phone: "",
    photoURL: defaultAvatar,
    favoriteCategories: [],
  });

  const [previewImage, setPreviewImage] = useState<string>(defaultAvatar);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const categoryList: string[] = [];
        snapshot.forEach((doc) => categoryList.push(doc.id));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const userRef = doc(db, "users", user.id);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data() as Partial<User>;
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            photoURL: data.photoURL || defaultAvatar,
            favoriteCategories: data.favoriteCategories || [],
          });
          setPreviewImage(data.photoURL || defaultAvatar);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const userRef = doc(db, "users", user.id);
      let finalPhotoURL = formData.photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `avatars/${user.id}/${photoFile.name}`);
        const uploadResult = await uploadBytes(storageRef, photoFile);
        finalPhotoURL = await getDownloadURL(uploadResult.ref);
      }

      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        photoURL: finalPhotoURL,
        favoriteCategories: formData.favoriteCategories || [],
      });

      alert("Profile updated!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Error updating profile. See console for details.");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFormData((prev) => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories?.includes(selected)
        ? prev.favoriteCategories.filter((cat) => cat !== selected)
        : [...(prev.favoriteCategories || []), selected],
    }));
  };

  if (loading) return <p>Loading user settings...</p>;

  return (
    <section className="bg-white rounded-lg p-10 my-12 mx-auto max-h-full w-3/4">
      <h2 className="text-2xl font-bold">Account Settings</h2>

      <div className="bg-indigo-400 border-indigo-950 border-4 rounded-lg p-5 m-auto max-w-full w-1/2">
        {previewImage && (
          <img
            src={previewImage}
            alt="User avatar"
            className="w-20 h-20 rounded-full m-0 p-0"
          />
        )}

        <div className="flex flex-col text-left decoration-none">
          <label>
            <strong className="block">Username:</strong>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="max-w-72 min-w-64 max-h-9 p-2 rounded-lg border-2 border-black mb-2 bg-violet-200 text-black"
              placeholder="Enter your name"
            />
          </label>

          <label>
            <strong className="block">Phone:</strong>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="max-w-72 min-w-64 max-h-9 p-2 rounded-lg border-2 border-black mb-2 bg-violet-200 text-black"
              placeholder="Enter your phone number"
            />
          </label>

          <label>
            <strong className="block">Upload Profile Picture:</strong>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-72 min-w-64 max-h-9 p-2 rounded-lg border-2 border-black mb-2 bg-violet-200 text-black"
            />
          </label>

          <label>
            <strong className="block">Favorite Categories:</strong>
            <select
              multiple
              value={formData.favoriteCategories || []}
              onChange={handleCategoryChange}
              className="max-w-72 min-w-64 p-2 rounded-lg border-2 border-black mb-2 bg-violet-200 text-black"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <Button onClick={handleSave} title="Save Settings" />
        </div>
      </div>
    </section>
  );
};

export default Settings;
