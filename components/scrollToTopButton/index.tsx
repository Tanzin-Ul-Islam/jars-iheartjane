import React, { useEffect,useState } from 'react'
import styles from './css/scroll.module.css'
import {MdKeyboardArrowUp} from "react-icons/md"

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const yOffset = window.pageYOffset;
        if (yOffset > 200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  
    return (
        <>
        <button
            className={`scroll-to-top-button ${isVisible ? 'd-block' : 'd-none'}`}
            onClick={scrollToTop}
        >
        
        <div>
            {/* <MdKeyboardArrowUp className='fs-24 mb-0'/> */}
            <img src="/images/nav-icons/scroll-top-icon.svg" alt="scroll to top" style={{ height: '30px' }} />
        </div>
        <div className='fw-bold'>
            TOP
        </div>
        </button>
        </>
    );
  };
  
  export default ScrollToTopButton;
  