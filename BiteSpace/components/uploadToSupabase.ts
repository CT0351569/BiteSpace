import * as FileSystem from "expo-file-system";
import supabaseClient from "@/components/supabaseClient";
import { nanoid } from "nanoid";
import "react-native-get-random-values";

const uploadToSupabase = async (
  imageUri: string,
  imageExtension = "jpg",
  bucketName = "BiteSpace"
): Promise<string | null> => {
  try {
    console.log(`[uploadToSupabase] Converting image at URI: ${imageUri}`);

    // Read the file as binary data
    const binaryData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!binaryData) {
      console.error("[uploadToSupabase] Unable to read image file");
      return null;
    }

    // Convert the base64 string into Uint8Array
    const fileBuffer = Uint8Array.from(atob(binaryData), (c) => c.charCodeAt(0));

    console.log(`[uploadToSupabase] Using bucket: ${bucketName}`);

    // Upload the file to Supabase storage
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(`${nanoid()}.${imageExtension}`, fileBuffer, {
        contentType: `image/${imageExtension}`,
        upsert: true,
      });

    if (error) {
      console.error("[uploadToSupabase] Upload error: ", error.message);
      return null;
    }

    if (!data?.path) {
      console.error("[uploadToSupabase] Upload returned no path");
      return null;
    }

    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      console.error("[uploadToSupabase] Public URL is null");
      return null;
    }

    console.log("[uploadToSupabase] Upload successful! Public URL: ", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("[uploadToSupabase] Unexpected error: ", err);
    return null;
  }
};

export default uploadToSupabase;
