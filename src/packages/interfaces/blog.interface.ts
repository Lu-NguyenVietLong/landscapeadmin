interface IBlogCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentCategory: IBlogCategory | string | null;
}