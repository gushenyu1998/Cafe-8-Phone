export interface FullOrderType {
    order_id: number,
    table: string,
    price: number,
    orders: OneOrderType[],
}

export interface OneOrderType {
    dish_id: number,
    order_name: string,
    note: string,
    tags: [string, number][]
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
    "defaultTags": [string, number][],
    "defaultMaterial": {
        [key: string]: number
    },
    "dishes": DishType[]
}

export interface TagsType {
    [key: string]: [string, number][]
}


//TableType: string[]