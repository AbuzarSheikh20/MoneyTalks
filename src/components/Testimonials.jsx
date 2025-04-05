import React from 'react';
import Slider from 'react-slick';
import Tilt from 'react-parallax-tilt';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const TestimonialsSection = () => {
  const testimonials = [
    { name: 'Abuzar', feedback: 'This app is amazing for managing my budget!' },
    { name: 'Shadaab', feedback: 'I saved so much money using this tool!' },
    { name: 'Any', feedback: 'A game-changer in personal finance management.' },
    { name: 'Many', feedback: 'A game-changer in personal finance management.' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <section className="py-20 h-screen flex flex-col items-center justify-center w-full bg-orange-200 text-black text-center">
      <h2 className="text-3xl font-semibold mb-10">What Our Users Say</h2>
      <div className="w-10/12 mx-auto">
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <Tilt key={index} tiltMaxAngleX={50} tiltMaxAngleY={100} className="p-6 py-20 border border-white rounded-lg shadow-xl bg-orange-500 text-white">
              <p className="italic">"{testimonial.feedback}"</p>
              <p className="mt-4 font-bold">{testimonial.name}</p>
            </Tilt>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsSection;