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
        <Link to="/" className="btn mt-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
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
              <span className="badge rounded-pill mb-4 px-4 py-2" style={{ backgroundColor: 'var(--primary-color)', fontSize: '0.9rem' }}>
                {isRtl ? 'تكنولوجيا وأعمال' : 'Tech & Business'}
              </span>

              {/* Responsive Title: fs-1 or h1 instead of display-4 for better mobile fit */}
              <h1 className="fw-bold mb-4" style={{ fontSize: 'calc(1.5rem + 1.5vw)', lineHeight: '1.4' }}>
                {blog.title}
              </h1>

              <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 gap-sm-3 mt-4 text-white-50">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
                    <span className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>F</span>
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
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm" data-aos="fade-up">

              {/* Intro Text inside a soft box */}
              <div
                className="mb-5 p-4 rounded-3"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRight: isRtl ? '4px solid var(--primary-color)' : 'none',
                  borderLeft: isRtl ? 'none' : '4px solid var(--primary-color)'
                }}
              >
                <p className="lead fw-bold mb-0 text-dark" style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
                  {blog.intro}
                </p>
              </div>

              {/* Sections */}
              <div className="blog-content">
                {blog.sections.map((section, idx) => (
                  <div key={idx} className="mb-5">
                    <h3 className="fw-bold mb-4 d-flex align-items-center" style={{ color: 'var(--dark-color)', fontSize: '1.4rem' }}>
                      <span className="me-2 ms-2" style={{ color: 'var(--primary-color)' }}>—</span>
                      {section.title}
                    </h3>
                    <div style={{ color: '#4a5568', fontSize: '1.1rem', lineHeight: '2' }}>
                      {section.content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer of the article */}
              <div className="mt-5 pt-4 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                <Link to="/" className="btn text-black px-5 py-2 rounded-pill fw-bold shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
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
        .blog-content p {
          text-align: justify;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
