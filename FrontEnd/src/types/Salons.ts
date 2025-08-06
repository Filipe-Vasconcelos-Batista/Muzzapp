export interface Salon {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    salonRoles: SalonRole[];
}

export interface SalonRole {
    roles: string;
}
