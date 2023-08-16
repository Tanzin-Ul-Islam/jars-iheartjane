import React from 'react'
import { useRouter } from 'next/router';
import Slider from "react-slick";
import { BsArrowLeftShort, BsArrowRightShort, BsInstagram } from "react-icons/bs";
import styles from "./css/instagram.module.css"
import { countPostedTime } from '../../utils/helper';
import Link from 'next/link';
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className="next"
            onClick={onClick}
        ><BsArrowRightShort /></div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className="previous"
            onClick={onClick}
        >
            <BsArrowLeftShort />
        </div>
    );
}
const Instagram = (props) => {
    const { images } = props;
    const router = useRouter()
    const list = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},]
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        adaptiveHeight: false,
        centerMode: false,
        arrows: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        dotsClass: 'dots',
        autoplay: false,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div>
            <Slider {...settings}>
                {images.map((image) => {
                    return (
                        <div className="slider-item h-100 pb-3" key={image.id}>
                            <Link href={image.permalink ? image.permalink : ''} rel="noopener noreferrer" target="_blank">
                                {/* style={{ backgroundImage: `linear-gradient(180deg,transparent,#000),url(${image.media_url})`, }} */}
                                <div className={`card border round-0 border-dark h-100 mx-2 flex-row align-items-start ${styles.card_insta}`} >

                                    {image.media_type === "VIDEO" ?
                                        <div>
                                            <video playsInline autoPlay muted loop preload="auto" style={{ width: '100%', height: '100%' }}>
                                                <source src={image.media_url} type="video/mp4" />
                                            </video>
                                        </div>
                                        :
                                        (
                                            <div className='h-100 w-100'>
                                                <picture>
                                                    <img
                                                        src={image.media_url}
                                                        style={{objectFit:"cover"}}
                                                        // alt={'asa'}
                                                        className="w-100 h-100" />
                                                </picture>
                                            </div>
                                        )
                                    }

                                    <div className={`text-white text-center ${styles.card_insta_box}`}>
                                        <div className={styles.custom_box_info}>
                                            <div className={styles.card_insta_logo}>
                                                <BsInstagram className='fs-22 mb-3' />
                                            </div>
                                            <div className={`ff-Montserrat400 ${styles.card_insta_caption_text}`}>
                                                {image.caption}
                                            </div>
                                            <div className={styles.card_insta_box_items}>
                                                <div className={styles.card_insta_box_items_inner}>
                                                    <div className={styles.card_insta_details}>
                                                        <div className={`${styles.card_insta_username} ff-Montserrat700`}>{image.username}</div>
                                                        <div className={`${styles.card_insta_date} ff-Montserrat700`}>{countPostedTime(image.timestamp)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-3 d-flex justify-content-center'>
                                                <picture>
                                                    <img className={styles.card_insta_avatar}
                                                        src="https://jars-dutchi.nyc3.cdn.digitaloceanspaces.com/default/jars-logo.png"
                                                        width={35}
                                                        alt="User avatar" />
                                                </picture>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.card_insta_bottom_container}>
                                        <div className="d-flex gap-2">
                                            <picture>
                                                <img className={styles.card_insta_bottom_avatar}
                                                    src="https://jars-dutchi.nyc3.cdn.digitaloceanspaces.com/default/jars-logo.png"
                                                    width={30}
                                                    alt="User avatar" />
                                            </picture>
                                            <div className="d-flex flex-column gap-1">
                                                <div className={`${styles.card_insta_bottom_username} ff-Montserrat700`}>{image.username}</div>
                                                <div className={`${styles.card_insta_bottom_date} ff-Montserrat400`}>{countPostedTime(image.timestamp)}</div>
                                            </div>
                                        </div>
                                        <div className={`${styles.card_insta_bottom_logo}`}>
                                            {/* <Link href={row.permalink ? row.permalink:''} passHref>
                                                  <a target={'_blank'}> */}
                                            <BsInstagram />
                                            {/* </a>
                                              </Link> */}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })
                }
            </Slider>
        </div>
    )
}

export default Instagram