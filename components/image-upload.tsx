"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImage, validateImageFile } from "@/lib/utils/upload";

interface ImageUploadProps {
  onUploadSuccess?: (result: any) => void;
  maxSize?: number;
  allowedTypes?: string[];
  className?: string;
}

export function ImageUpload({ 
  onUploadSuccess, 
  maxSize = 5 * 1024 * 1024, 
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  className = ""
}: ImageUploadProps) {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      const validation = validateImageFile(selectedFile);
      
      if (!validation.isValid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setFile(selectedFile);
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      setError("Please select a file and ensure you're logged in");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const result = await uploadImage(file, user.id, {
        maxSize,
        allowedTypes,
        prefix: "fundraisers"
      });

      onUploadSuccess?.(result);
      setFile(null);
      setPreview("");
      setProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview("");
    setError("");
    setProgress(0);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-blue-600" />
          Upload Image
        </CardTitle>
        <CardDescription>
          Upload images for your fundraiser. Supports JPEG, PNG, GIF, and WebP up to 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Choose Image
          </Label>
          <input
            id="image-upload"
            type="file"
            accept={allowedTypes.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />
          
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-gray-300"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <div className="text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, GIF, WebP up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading || !user}
            className="flex-1"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          {file && (
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={uploading}
            >
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}