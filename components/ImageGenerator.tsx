import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { SparklesIcon, UploadIcon, XIcon } from './icons';
import Loader from './Loader';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [referenceImage, setReferenceImage] = useState<{ file: File | null, base64: string | null }>({ file: null, base64: null });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReferenceImage({ file, base64: reader.result as string });
        };
        reader.readAsDataURL(file);
        setError(null);
      } else {
        setError("Please upload a valid image file (JPEG or PNG).");
      }
    };

    const clearReferenceImage = () => {
      setReferenceImage({ file: null, base64: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImageUrl(null); // Clear previous image
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            if (referenceImage.base64 && referenceImage.file) {
                // Image-to-Image Generation
                const imagePart = {
                    inlineData: {
                        mimeType: referenceImage.file.type,
                        data: referenceImage.base64.split(',')[1],
                    },
                };
                const textPart = { text: prompt };

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [imagePart, textPart] },
                    config: {
                        responseModalities: [Modality.IMAGE],
                    },
                });

                let foundImage = false;
                const candidate = response.candidates?.[0];
                if (candidate?.content?.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.inlineData) {
                            const base64ImageBytes = part.inlineData.data;
                            const mimeType = part.inlineData.mimeType;
                            const generatedUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                            setImageUrl(generatedUrl);
                            foundImage = true;
                            break; 
                        }
                    }
                }
                
                if (!foundImage) {
                   setError('The AI could not generate an image from the provided input. It might have been blocked due to safety settings.');
                }

            } else {
                // Text-to-Image Generation
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: {
                      numberOfImages: 1,
                      outputMimeType: 'image/jpeg',
                      aspectRatio: '1:1',
                    },
                });

                if (response.generatedImages?.[0]?.image?.imageBytes) {
                    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                    const generatedUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                    setImageUrl(generatedUrl);
                } else {
                    setError('The AI could not generate an image. Please try a different prompt.');
                }
            }

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to generate image. Please check the prompt and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-24 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-text-primary mb-4">Generative Playground</h3>
            <p className="text-center text-text-secondary mb-8">
                Bring your ideas to life. Type a description, or upload a reference image and describe the changes you want to make.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/jpeg, image/png"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 bg-glass-bg border-2 border-dashed border-glass-border rounded-lg text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UploadIcon size={24} />
                        <span className="text-sm font-semibold">{referenceImage.file ? 'Change Image' : 'Upload Reference'}</span>
                    </button>
                </div>
                <div className="md:col-span-2 relative">
                    {referenceImage.base64 ? (
                        <>
                            <img src={referenceImage.base64} alt="Reference" className="w-full h-full object-cover rounded-lg" />
                            <button
                                onClick={clearReferenceImage}
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                                aria-label="Clear reference image"
                            >
                                <XIcon size={16} />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-glass-bg border border-glass-border rounded-lg text-text-secondary text-sm p-4">
                            Your reference image will be shown here.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative group flex-grow">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-pink-600 rounded-lg blur opacity-0 group-focus-within:opacity-75 transition duration-200"></div>
                     <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                        placeholder={referenceImage.file ? "e.g., Swap the face with a celebrity" : "A futuristic cityscape, photorealistic"}
                        className="relative w-full flex-grow bg-background-secondary border border-background-tertiary rounded-md px-4 py-3 text-text-primary focus:outline-none placeholder:italic placeholder:text-text-secondary/80"
                        disabled={isLoading}
                    />
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-40 px-4 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-80 transition-all duration-300 disabled:bg-opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-accent/50 transform hover:scale-105"
                >
                    {isLoading ? <Loader size="sm" /> : <SparklesIcon size={20} />}
                    <span>Generate</span>
                </button>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            
            <div className="mt-8 aspect-square bg-glass-bg border border-glass-border backdrop-blur-lg rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300">
                {isLoading && !imageUrl && <Loader size="lg" className="text-accent" />}
                {imageUrl && (
                    <img src={imageUrl} alt={prompt} className="w-full h-full object-cover animate-in" />
                )}
                 {!isLoading && !imageUrl && (
                    <div className="text-center text-text-secondary p-4">
                        <SparklesIcon size={48} className="mx-auto mb-2 text-accent/50" />
                        <p>Your generated image will appear here.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ImageGenerator;