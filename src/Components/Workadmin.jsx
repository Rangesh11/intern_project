import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

const Workadmin = () => {
  const options = [
    { value: 'tata', label: 'TATA' },
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const [cars, setCars] = useState([]);
  const imagesRef = useRef([]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cars');
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        } else {
          console.error('Failed to fetch cars');
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
          } else {
            entry.target.classList.remove('appear');
          }
        });
      },
      { threshold: 0.1 }
    );

    imagesRef.current.forEach(image => {
      if (image) {
        observer.observe(image);
      }
    });

    return () => {
      imagesRef.current.forEach(image => {
        if (image) {
          observer.unobserve(image);
        }
      });
    };
  }, [cars]);

  return (
    <div className="flex flex-col bg-black min-h-screen items-center  gap-8">
      <style jsx>{`
        @keyframes appearFromInside {
          0% {
            opacity: 0;
            transform: translateY(50%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animated-image {
          opacity: 0;
          transform: translateY(50%);
          transition: transform 1s ease-out, opacity 1s ease-out;
        }
        .animated-image.appear {
          opacity: 1;
          transform: translateY(0);
        }
        .delete-icon {
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .car-container:hover .delete-icon {
          display: block;
          opacity: 1;
        }
      `}</style>
      <div className="flex flex-col gap-7 mt-8 items-center w-full">
        <Select
          className="w-96"
          styles={{
            control: (provided, state) => ({
              ...provided,
              backgroundColor: selectedOption ? '#3a3a3a' : 'initial',
              border: state.isFocused ? '1px solid white' : 'none',
              borderRadius: '10px', // Rounded border
              color: 'white',
              '&:hover': {
                border: '1px solid white', // Border color when hovered
              },
            }),
            input: (provided) => ({
              ...provided,
              color: 'white',
              borderColor: 'white', // Border color of the input
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#3a3a3a',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#292929' : '#3a3a3a',
              color: 'white',
              border: 'none',
              '&:active': {
                backgroundColor: '#292929',
                border: '1px solid white',
              },
             
            }),
            placeholder: (provided) => ({
              ...provided,
              color: 'white',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',
            }),
          }}
          value={selectedOption}
          onChange={handleChange}
          options={options}
          isSearchable
          placeholder="Type or select the car"
        />
        <div className="grid grid-cols-3 gap-4 p-5">
          {cars.map((car, index) => (
            <div className="relative car-container" key={car._id}>
              <img
                ref={el => imagesRef.current[index] = el}
                className="h-full w-full object-cover transition duration-300 ease-in-out hover:grayscale hover:scale-105 animated-image"
                src={`http://localhost:5000/${car.images[0].replace(/\\/g, '/')}`}
                alt="Car"
              />
              <h3 className="absolute inset-0 flex justify-center items-center text-lg font-semibold text-white bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition duration-300 ease-in-out">
                Car Image
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="delete-icon">
                  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"></path>
                </svg>
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workadmin;
