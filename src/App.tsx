import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Konva from "konva";
import ExampleAd from './correct-path-to-example-ad';
import { KonvaImage } from 'react-konva';



const ExampleAd = () => <div>Example Ad</div>;
type KonvaImage = Konva.Image;
interface ExampleAdProps {
  productImage: string;
}

const ExampleAd: React.FC<ExampleAdProps> = ({ productImage }) => {
  return <img src={productImage} alt="Product" />;
};


const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleBackgroundRemoval = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image_file", image);
  
    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg", // API endpoint
        formData,
        {
          headers: {
            "X-Api-Key": "Sa9WjCQHMo1K44o5h5DBRz9Y", // Replace with your remove.bg API key
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // To receive the processed image as a blob
        }
      );
  
      // Convert blob to URL for display
      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
  
      setPreview(imageUrl); // Update the preview with the background-removed image
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Failed to remove background. Please try again.");
    }
  };

  const handleDownload = () => {
    if (preview) {
      const link = document.createElement("a");
      link.href = preview; // The URL of the processed image
      link.download = "processed-image.png"; // Default filename
      link.click();
    } else {
      alert("No image to download!");
    }
  };

  
  

  return (
    <Container>
      <h1>Facebook Ad Creator</h1>
      <UploadSection>
        <label htmlFor="imageUpload">Upload Product Image</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {preview && <PreviewImage src={preview} alt="Uploaded preview" />}
        {preview && <ExampleAd productImage={preview} />}
        <button onClick={handleBackgroundRemoval}>Remove Background</button>
        <button onClick={handleDownload} disabled={!preview}>Download Image</button>
        <KonvaImage src="/path/to/image.png" />
      </UploadSection>
    </Container>
  );
};

export default App;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  label {
    font-size: 18px;
    margin-bottom: 10px;
  }

  input {
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const PreviewImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  margin: 20px;
  border: 2px solid #ddd;
  border-radius: 5px;
`;


