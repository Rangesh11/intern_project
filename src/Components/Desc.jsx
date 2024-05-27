import React, { useRef, useState, useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import { useParams } from 'react-router-dom';

// Kick off the polyfill!
smoothscroll.polyfill();

const Desc = () => {
  const [mainImage, setMainImage] = useState("");
  const [carImages, setCarImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const scrollContainerRef = useRef(null);
  let { id } = useParams();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setCarImages(data.images);
          if (data.images.length > 0) {
            setMainImage(`http://localhost:5000/${data.images[0].replace(/\\/g, '/')}`);
          }
        } else {
          console.error('Failed to fetch car details');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const newScrollLeft = scrollLeft - 200;
      const maxScrollLeft = 0;

      if (newScrollLeft <= maxScrollLeft) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        scrollContainerRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const newScrollLeft = scrollLeft + 200;

      if (newScrollLeft >= maxScrollLeft) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      }
    }
  };

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  return (
    <div className='flex flex-col w-full bg-black h-full gap-20'>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          padding: 1rem;
          cursor: pointer;
          z-index: 10;
          border-radius: 50%;
        }
        .arrow-left {
          left: 0;
        }
        .arrow-right {
          right: 0;
        }
        .arrow svg {
          width: 24px;
          height: 24px;
          stroke: currentColor;
        }
      `}</style>
    
      <div className='flex flex-col items-center gap-11 p-5'>
        <h1 className='text-5xl text-white font-semibold'>{title}</h1>
        <h2 className='text-3xl text-white font-semibold'>{category}</h2>
        <p className="text-white w-6/12">{description}</p>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          mainImage && <img src={mainImage} alt="Main" className="w-8/12" onError={(e) => { e.target.src = 'fallback-image-url'; }} />
        )}
        <div className='relative w-8/12 flex flex-col'>
          <button className='arrow arrow-left' onClick={scrollLeft}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-left"><path d="M18 15H12v4l-7-7 7-7v4h6v6z" /></svg>
          </button>
          <div ref={scrollContainerRef} className='flex overflow-x-auto hide-scrollbar gap-5'>
            {carImages.map((image, index) => (
              <img
                key={index}
                className="h-48 w-auto hover:scale-105 cursor-pointer "
                src={`http://localhost:5000/${image.replace(/\\/g, '/')}`}
                alt={`Car image ${index}`}
                onClick={() => handleImageClick(`http://localhost:5000/${image.replace(/\\/g, '/')}`)}
                onError={(e) => { e.target.src = 'fallback-image-url'; }}
              />
            ))}
          </div>
          <button className='arrow arrow-right' onClick={scrollRight}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-right"><path d="M6 9h6V5l7 7-7 7v-4H6V9z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Desc;
