"use client";

import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/Firebase";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setName(user.name || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 1024 * 1024 * 2) {
      toast.error("Max file size is 2MB");
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoURL = user?.photoURL || "";

      if (image) {
        const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, async () => {
            photoURL = await getDownloadURL(imageRef);
            resolve();
          });
        });
      }

      await updateUserProfile({
        name,
        bio,
        photoURL,
        updatedAt: serverTimestamp(),
      });
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Failed to save profile");
    }
    setSaving(false);
  };

  const handleImageDelete = async () => {
    try {
      const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await deleteObject(imageRef);
      await updateUserProfile({ photoURL: "" });
      toast.success("Profile image deleted");
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Bio"
          className="w-full p-2 border rounded"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-violet-500 text-white px-4 py-2 rounded"
            disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {user?.photoURL && (
            <button
              type="button"
              onClick={handleImageDelete}
              className="text-red-500">
              Delete Image
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
