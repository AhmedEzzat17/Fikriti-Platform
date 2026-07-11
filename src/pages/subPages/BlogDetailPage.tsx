import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getBlogData } from '../../data/blogsData';
import { useFadeIn } from '../../hooks/useFadeIn';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLang, t } = useLanguage();
  const isRtl = currentLang === 'ar';
  useFadeIn();

  const blogId = id ? parseInt(id, 10) : 1;
  const blog = getBlogData(blogId, currentLang);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: '100px', minHeight: '60vh' }}>
        <h2>{isRtl ? 'المقال غير موجود' : 'Blog not found'}</h2>
        <Link to="/" className="btn mt-3 text-white" style={{ backgroundColor: 'var(--main-color)' }}>
          {t('home') || 'الرئيسية'}
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page bg-light" style={{ minHeight: '100vh', paddingBottom: '50px' }}>

      {/* Hero Banner (Auto height based on content to prevent overlap on mobile) */}
      <div
        className="blog-hero position-relative py-5"
        style={{
          backgroundColor: '#111',
          marginTop: '70px', /* To clear navbar */
          overflow: 'hidden'
        }}
        data-aos="fade-in"
      >
        {/* Background Image */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${blog.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        ></div>

        {/* Hero Content */}
        <div className="container position-relative z-index-1 text-white py-4 py-md-5">
          <div className="row justify-content-center text-center">
            <div className="col-12 col-lg-10">
              <span className="badge rounded-pill mb-4 px-4 py-2" style={{ backgroundColor: 'var(--main-color)', fontSize: '0.9rem' }}>
                {isRtl ? 'تكنولوجيا وأعمال' : 'Tech & Business'}
              </span>

              {/* Responsive Title */}
              <h1 className="blog-title fw-bold mb-4">
                {blog.title}
              </h1>

              <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 gap-sm-3 mt-4 text-white-50">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
                    <span className="fw-bold" style={{ color: 'var(--main-color)', fontSize: '1rem' }}>F</span>
                  </div>
                  <span className="fw-medium text-white">{isRtl ? 'الناشر: فكرتي' : 'Publisher: Fikriti'}</span>
                </div>
                <span className="d-none d-sm-inline opacity-50">•</span>
                <span className="fw-medium">{new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="bg-white p-3 p-md-5 rounded-4 shadow-sm" data-aos="fade-up">

              {/* Intro Text inside a soft box */}
              <div
                className="mb-4 mb-md-5 p-3 p-md-4 rounded-3"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRight: isRtl ? '4px solid var(--main-color)' : 'none',
                  borderLeft: isRtl ? 'none' : '4px solid var(--main-color)'
                }}
              >
                <p className="blog-intro-text lead fw-bold mb-0 text-dark">
                  {blog.intro}
                </p>
              </div>

              {/* Sections */}
              <div className="blog-content">
                {blog.sections.map((section, idx) => (
                  <div key={idx} className="mb-4 mb-md-5">
                    <h3 className="blog-section-title fw-bold mb-3 mb-md-4 d-flex align-items-center" style={{ color: 'var(--dark-color)' }}>
                      <span className="me-2 ms-2" style={{ color: 'var(--main-color)' }}>—</span>
                      {section.title}
                    </h3>
                    <div className="blog-section-content">
                      {section.content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="mb-3 mb-md-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer of the article */}
              <div className="mt-5 pt-4 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                <Link to="/" className="btn text-white px-5 py-2 rounded-pill fw-bold shadow-sm" style={{ backgroundColor: 'var(--main-color)' }}>
                  {isRtl ? '← العودة للرئيسية' : '← Back to Home'}
                </Link>

                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">Web</span>
                  <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">App</span>
                  <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">Tech</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .blog-detail-page .blog-title {
          font-size: calc(1.6rem + 1.5vw);
          line-height: 1.35;
        }

        .blog-detail-page .blog-intro-text {
          font-size: 1.15rem;
          line-height: 1.85;
        }

        .blog-detail-page .blog-section-title {
          font-size: 1.4rem;
        }

        .blog-detail-page .blog-section-content {
          color: #4a5568;
          font-size: 1.1rem;
          line-height: 1.95;
        }

        .blog-detail-page .blog-content p {
          text-align: justify;
        }

        /* Responsive adjustments */
        @media (max-width: 767.98px) {
          /* Override global row constraint */
          .blog-detail-page .row > * {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .blog-detail-page .blog-title {
            font-size: 1.75rem;
            line-height: 1.35;
          }

          .blog-detail-page .blog-intro-text {
            font-size: 1.05rem;
            line-height: 1.75;
          }

          .blog-detail-page .blog-section-title {
            font-size: 1.25rem;
          }

          .blog-detail-page .blog-section-content {
            font-size: 1rem;
            line-height: 1.8;
          }
          
          .blog-detail-page .blog-content p {
            text-align: start; /* Prevent awkward justification gaps on mobile */
          }
          
          body[dir="rtl"] .blog-detail-page .blog-content p {
            text-align: right;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
