interface ContactCmsInterface {
    cmsData: [
        {
            buttonText?: string
            contactNumber?: string
            description?: string
            email?: string
            id?: string
            subTitle?: string
            title?: string
            location?:string
            phone?:string
        }
    ],
    commonBannerCmsData:[
        {
            buttonLink?:string
            buttonText?:string
            id?:string
            subTitle?:string
            title?:string
        }

    ]
}

export default ContactCmsInterface