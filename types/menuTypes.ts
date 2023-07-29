export interface menuType {
    _id: string;
    name: string;
    description: string;
    price: number;
    ingredients: [string];
    createdAt: Date;
    updatedAt: Date;
}
