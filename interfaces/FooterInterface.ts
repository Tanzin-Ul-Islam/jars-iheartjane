interface FooterCmsInterface {
  cmsData: [
    {
      copyrightText?: string,
      title?: string,
      description?: string,
      subTitle?: string,
      buttonOneText?: string,
      buttonTwoText?: string,
      buttonOneLink?: string,
      buttonTwoLink?: string,
      sectionTwoTitle?: string,
      sectionTwoSubTitle?: string,
      sectionTwoButtonText?: string,
      sectionTwoButtonLink?: string,
    }
  ],
  socialPackData: [
    {
      className?: string,
      link?: string
    },
    {
      className?: string,
      link?: string
    }
  ]

}

export default FooterCmsInterface