export interface menuType {
    _id: string;
    menuNumber: number;
    name: string;
    description: string;
    price: number;
    ingredients: number[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
