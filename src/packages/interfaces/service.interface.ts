interface IService {
    _id: string;
    title: string;
    images: File[];
    message: string;
    content: string,
    policy?: string,
    projects?: {name: string, images: File[]}
}

