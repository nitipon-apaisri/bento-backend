export interface menuType {
    _id: string;
    menuNumber: number;
    name: string;
    description: string;
    price: number;
    ingredients: string[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
