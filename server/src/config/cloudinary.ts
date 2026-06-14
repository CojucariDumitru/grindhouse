import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export const cloudinaryConfigured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);

/**
 * Upload a base64 / data-URI image to Cloudinary and return the secure URL.
 * Images are stored under the `grindhouse/menu` folder.
 */
export async function uploadMenuImage(dataUri: string): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary is not configured on the server.');
  }
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'grindhouse/menu',
    resource_type: 'image',
    transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }],
  });
  return result.secure_url;
}

export default cloudinary;
