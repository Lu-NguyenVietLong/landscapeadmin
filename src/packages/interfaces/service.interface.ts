interface IService {
    _id: string;
    title: string;
    images: any;
    message: string;
    content: string,
    policy?: string,
    projects?: {name: string, images: any}[]
}

