export interface IBlogCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentCategory: IBlogCategory | string | null;
}

export interface IBlog {
    _id?: string; // _id thường được tạo bởi MongoDB, nên là optional
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    // categories có thể là một mảng các ObjectId (kiểu string) hoặc là object tùy theo populate
    categories?: string[]; 
    tags?: string[];
    published?: boolean;
    publicationDate?: Date;
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
    };
    views?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }