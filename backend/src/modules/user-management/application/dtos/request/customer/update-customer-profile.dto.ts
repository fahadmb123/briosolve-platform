export type UpdateCustomerProfileInputDataDto = {
    name?: string,
    about?: string,
    profile_image?: string,
    service_radius_km?: number | null
}

export type UpdateCustomerProfileInputDto = {
    id:string,
    data:UpdateCustomerProfileInputDataDto
}
