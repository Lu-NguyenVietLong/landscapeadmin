interface IService {
    _id: string;
    title: string;
    slug: string;
    images: File[];
    message: string;
    content: string,
    policy?: string,
    projects?: {name: string, images: string[]}
}