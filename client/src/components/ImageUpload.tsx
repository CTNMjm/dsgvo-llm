import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: 'logos' | 'screenshots' | 'blog' | 'general';
  label?: string;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = 'Bild',
  placeholder = 'https://...',
  accept = 'image/*',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = trpc.upload.image.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      toast.success('Bild erfolgreich hochgeladen');
    },
    onError: (error) => {
      toast.error(`Upload fehlgeschlagen: ${error.message}`);
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Bitte wählen Sie eine Bilddatei aus');
      return;
    }
    
    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Die Datei ist zu groß. Maximum: ${maxSizeMB} MB`);
      return;
    }
    
    setIsUploading(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      uploadMutation.mutate({
        data: base64,
        filename: file.name,
        folder,
        contentType: file.type
      });
    };
    reader.onerror = () => {
      toast.error('Fehler beim Lesen der Datei');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="text-xs">
            <Upload className="h-3 w-3 mr-1" /> Hochladen
          </TabsTrigger>
          <TabsTrigger value="url" className="text-xs">
            <LinkIcon className="h-3 w-3 mr-1" /> URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-2">
          {/* Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
              dragActive 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-slate-200 hover:border-slate-300'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  <span className="text-sm text-slate-500">Wird hochgeladen...</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-slate-400" />
                  <div className="text-sm text-slate-500">
                    <span className="font-medium text-orange-500">Klicken</span> oder Datei hierher ziehen
                  </div>
                  <span className="text-xs text-slate-400">Max. {maxSizeMB} MB</span>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="mt-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isUploading}
          />
        </TabsContent>
      </Tabs>
      
      {/* Preview */}
      {value && (
        <div className="relative mt-2">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Vorschau"
              className="h-20 w-auto rounded border border-slate-200 object-contain bg-white"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={clearImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">{value}</p>
        </div>
      )}
    </div>
  );
}
