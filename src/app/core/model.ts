export interface Response {
    message?: string;
}

export interface User {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface UserInfo {
    id: number;
    name: string;
    token: string;
    email: string;
    isLogin: boolean;
    message: string;
}

export interface Filter {
    activePage?: number;
    rowCount?: number;
    searchString?: string;
    orderDetail?: OrderDetail;
    columnConfigurations?: ColumnConfiguration[];
}


export interface OrderDetail {
    columnName?: string;
    orderType?: string;
}

export interface ColumnConfiguration {
    columnName?: string;
    columnNameDisplay?: string;
    columnNameInCamle?: string;
    searchValue?: string;
    dataType?: string;
    enumString?: string;
    searchable?: boolean;
    isExpandable?: boolean;
    isSortable?: boolean;
    sortingType?: string;
    foreignKey?: string;
    foreignTable?: string;
}

export interface Pagination {
    activePage: number;
    totalItem: number;
    data?: any[];
    columnData?: ColumnConfiguration[];
    initialCount: number;
    lastCount: number;
    rowCount: number;
    searchString: string;
    controller?: string;
    editAction?: string;
    deleteAction?: string;
    formAction?: string;
    isExpandable?: boolean;
}

export interface Category {
    id?: number;
    categoryName?: string;
    description?: string;
    isAdminCategory?: boolean;
}

export interface EntityResponse {
    message?: string;
    isCreated?: boolean;
}

export interface Product {
    productId?: number;
    selectedCategory?: number | string;
    productName?: string;
    productDescription?: string;
    isAvailable?: number | boolean;
    productSize?: number | string;
    serialNumber?: number;
    orderDate?: Date | string;
    supplierEmail?: string;
    file?: File;
    imagePath?: string;
}