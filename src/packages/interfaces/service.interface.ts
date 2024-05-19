interface IService {
    title: string;
    slug: string;
    images: string[];
    message: string;
    content: string,
    policy: string,
    projects: {name: string, images: string[]}
}