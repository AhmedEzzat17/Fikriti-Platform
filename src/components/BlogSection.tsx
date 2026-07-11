import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';

const BlogSection: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const isRtl = currentLang === 'ar';

  const blogs = [
    {
      id: 1,
      title: t('blog_1_title'),
      desc: t('blog_1_desc'),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: t('blog_2_title'),
      desc: t('blog_2_desc'),
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: t('blog_3_title'),
      desc: t('blog_3_desc'),
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: t('blog_4_title'),
      desc: t('blog_4_desc'),
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      title: t('blog_5_title'),
      desc: t('blog_5_desc'),
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      title: t('blog_6_title'),
      desc: t('blog_6_desc'),
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="blog-section py-5" data-aos="fade-up">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ color: "var(--dark-color)" }}>{t('blog_title')}</h2>
          <p className="text-muted">{t('blog_subtitle')}</p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          dir={isRtl ? 'rtl' : 'ltr'}
          key={isRtl ? 'rtl' : 'ltr'} // Force re-render on language change for proper RTL layout
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="blog-swiper"
          style={{ paddingBottom: '3rem' }}
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id} className="h-auto">
              <div className="card h-100 border-0 shadow-sm blog-card mx-2 my-2">
                <Link to={`/blog/${blog.id}`} className="text-decoration-none">
                  <div className="blog-img-wrapper overflow-hidden" style={{ height: "200px" }}>
                    <img src={blog.image} className="card-img-top w-100 h-100" style={{ objectFit: "cover" }} alt={blog.title} />
                  </div>
                </Link>
                <div className="card-body d-flex flex-column p-4">
                  <Link to={`/blog/${blog.id}`} className="text-decoration-none">
                    <h5 className="card-title fw-bold mb-3" style={{ color: "var(--dark-color)" }}>{blog.title}</h5>
                  </Link>
                  <p className="card-text text-muted flex-grow-1" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>{blog.desc}</p>
                  <Link to={`/blog/${blog.id}`} className="mt-3 text-decoration-none fw-bold" style={{ color: "var(--main-color)" }}>
                    {t('blog_read_more')} {isRtl ? '←' : '→'}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .blog-section {
          background-color: #ffffff;
        }
        .blog-card {
          border-radius: 15px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          background-color: #fff;
        }
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
        }
        .blog-img-wrapper img {
          transition: transform 0.5s ease;
        }
        
        /* Swiper specific styles */
        .blog-swiper .swiper-pagination-bullet-active {
          background-color: var(--main-color);
        }
        .blog-swiper .swiper-button-next,
        .blog-swiper .swiper-button-prev {
          color: var(--main-color);
          background-color: rgba(255, 255, 255, 0.9);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .blog-swiper .swiper-button-next:after,
        .blog-swiper .swiper-button-prev:after {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        /* Hide arrows on mobile for cleaner look */
        @media (max-width: 768px) {
          .blog-swiper .swiper-button-next,
          .blog-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default BlogSection;
