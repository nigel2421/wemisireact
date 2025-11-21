
// Converts an image URL to a base64 string by fetching and using a FileReader.
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    // Using a proxy to avoid potential CORS issues with fetching images from a different origin.
    const proxiedUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // result is a data URL (e.g., data:image/jpeg;base64,...)
        // We need to strip the prefix for the Gemini API
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image URL to base64:", error);
    // If the proxy fails, it's better to inform the user than to crash.
    // In a real app, we might have more robust error handling or fallbacks.
    throw new Error('Could not load product image. This might be a network or CORS issue.');
  }
};

// Converts a File object (from a file input) to a base64 string.
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // result is a data URL, strip the prefix
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
