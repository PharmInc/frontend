export interface FileUploadResponse {
  id: string;
  filename: string;
  size: number;
  content_type: string;
  url: string;
  type?: string;
  extension?: string;
  objectKey?: string;
  folderId?: string;
}

export interface FolderContentsResponse {
  folderId: string;
  files: FileUploadResponse[];
  count: number;
}

export interface FileUploadParams {
  file: File;
  type?: 'image' | 'document' | 'video';
  folderId: string;
}

const allowedTypes = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
};

export const getFileTypeFromMime = (mimeType: string): 'image' | 'document' | 'video' | 'other' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || 
      mimeType.includes('document') || 
      mimeType.includes('text') || 
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel') ||
      mimeType.includes('csv')) {
    return 'document';
  }
  return 'other';
};

export const uploadFile = async ({ file, type, folderId }: FileUploadParams): Promise<FileUploadResponse> => {
  try {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);
    if (type) {
      formData.append('type', type);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      id: result.id,
      filename: result.filename,
      size: result.size,
      content_type: result.content_type,
      url: result.url,
      type: result.type,
      extension: result.extension,
      objectKey: result.objectKey,
      folderId: result.folderId,
    };

  } catch (error) {
    console.error('File upload failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const uploadMultipleFiles = async (
  files: File[],
  folderId: string
): Promise<FileUploadResponse[]> => {
  const uploadPromises = files.map(file => {
    const fileType = getFileTypeFromMime(file.type);
    return uploadFile({ 
      file, 
      type: fileType !== 'other' ? fileType : undefined, 
      folderId 
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple file upload failed:', error);
    throw error;
  }
};

export const fetchFolderContents = async (folderId: string): Promise<FolderContentsResponse> => {
  try {
    const response = await fetch(`/api/fetch-folder?folderId=${folderId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch folder contents: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch folder contents failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to fetch folder contents. Please try again.');
  }
};

export const getFileUrl = (fileId: string, type: string = 'files', extension: string = ''): string => {
  return `/api/cdn/${fileId}?type=${type}&ext=${extension}`;
};

export const getFolderFileUrl = (folderId: string, fileId: string, filename?: string): string => {
  const url = `/api/cdn/${folderId}/${fileId}`;
  return filename ? `${url}?filename=${encodeURIComponent(filename)}` : url;
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/delete?folderId=${folderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete folder: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete folder failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to delete folder. Please try again.');
  }
};

export const deleteFile = async (fileId: string, extension?: string): Promise<void> => {
  try {
    const url = `/api/delete?fileId=${fileId}${extension ? `&extension=${extension}` : ''}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete file: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete file failed:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to delete file. Please try again.');
  }
};
