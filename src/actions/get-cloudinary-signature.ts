"use server";

import crypto from 'crypto';

export async function getCloudinarySignature() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        success: false,
        error: "Cloudinary credentials are not configured",
      };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    const folder = "brand-zone";
    const tags = "brand-zone";

    const params: Record<string, string | number> = {
      folder,
      tags,
      timestamp
    };

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc: Record<string, string | number>, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    const signatureString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + apiSecret;

    console.log("String to sign:", Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&'));

    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    return {
      success: true,
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder,
      tags
    };
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return {
      success: false,
      error: "Failed to generate signature. Please try again.",
    };
  }
} 