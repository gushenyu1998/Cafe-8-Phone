export interface FullOrderType {
    order_id: number,
    table: string,
    price: number,
    orders: OneOrderType[],
}

export interface OneOrderType {
    dish_id: number,
    order_name: string, // need plus one Dish ID here
    note: string,
    tags: string[]
    quantity: number,
    price: number
}

export interface DishType {
    "id": number,
    "name": string,
    "price": number,
    "material": {
        [key: string]: number
    }
}

export interface MenuType {
    "sectionName": string,
    "tagSection": string[],
    "defaultTags": string[],
    "defaultMaterial": {
        [key: string]: number
    },
    "dishes": DishType[]
}