interface CareerInterface {
    careerData: [
        {
            id?: string,
            description?: string,
            jobType?: string,
            location?: string,
            salary?: string,
            title?: string,
        }
    ],
    cmsData: [
        {
            id?: string,
            modalButtonText?: string,
            modalDescription?: string,
            modalSubTitle?: string,
            modalTitle?: string,
            pageTitle?: string,
        }
    ]

}

export default CareerInterface