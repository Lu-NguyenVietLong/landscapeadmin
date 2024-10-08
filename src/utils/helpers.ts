import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const getFullImageUrl = (imageUrlFromApi: string) => {
  const baseUrl = 'https://res.cloudinary.com'
  return baseUrl + imageUrlFromApi;
};

const removeBaseUrlImage = (fullImageUrl: string) => {
  const baseUrl = 'https://res.cloudinary.com';
  return fullImageUrl.startsWith(baseUrl) ? fullImageUrl.slice(baseUrl.length) : fullImageUrl;
};

export { cn, getFullImageUrl, removeBaseUrlImage };
