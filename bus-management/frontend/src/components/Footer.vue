<template>
    <footer class="pro-footer">
      <div class="footer-container">
        <div class="footer-section footer-brand-info">
          <div class="footer-brand">
            <i class="fas fa-bus footer-logo-icon"></i>
            <span class="footer-title">EAST Express Ticket</span>
          </div>
          <p class="brand-tagline">Đặt vé xe tiện lợi, nhanh chóng, an toàn.</p>
          <div class="footer-socials">
            <a href="#" title="Facebook" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" title="Twitter" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" title="Instagram" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" title="LinkedIn" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
  
        <div class="footer-section footer-links">
          <h4 class="section-title">Liên kết nhanh</h4>
          <ul>
            <li><a href="#"><i class="fas fa-users"></i> Về chúng tôi</a></li>
            <li><a href="#"><i class="fas fa-concierge-bell"></i> Dịch vụ</a></li>
            <li><a href="#"><i class="fas fa-briefcase"></i> Tuyển dụng</a></li>
            <li><a href="#"><i class="fas fa-question-circle"></i> Câu hỏi thường gặp</a></li>
          </ul>
        </div>
  
        <div class="footer-section footer-contact">
          <h4 class="section-title">Liên hệ</h4>
          <address>
            <p><i class="fas fa-map-marker-alt"></i> 89 Tân Lập 1, Quận 9, TP.HCM</p>
            <p><i class="fas fa-phone-alt"></i> <a href="tel:+84987445667">+(84) 987 445 667</a></p>
            <p><i class="fas fa-envelope"></i> <a href="mailto:EET@email.com">EET@email.com</a></p>
          </address>
        </div>
      </div>
  
      <div class="footer-bottom">
        <p class="footer-copyright">Bản quyền &copy; {{ currentYear }} NPKHTech. All rights reserved.</p>
        <div class="footer-terms">
          <a href="#">Chính sách bảo mật</a>
          <span class="separator">|</span>
          <a href="#">Điều khoản dịch vụ</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const currentYear = ref(new Date().getFullYear());
  </script>
  <style scoped>
  /* Import Google Fonts (Inter hoặc Roboto) nếu chưa có trong index.html */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  .pro-footer {
    width: 100%;
    background: #1A202C;
    color: #E2E8F0;
    padding-top: 1.2rem;
    font-family: 'Inter', sans-serif;
    position: relative;
    left: 0;
    bottom: 0;
    z-index: 999;
  }
  
  .footer-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem 1.2rem 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 0.7rem;
  }
  
  .footer-section {
    flex: 1;
    min-width: 220px;
  }
  
  .footer-brand-info {
    flex: 2;
    min-width: 280px;
  }
  
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
  }
  
  .footer-logo-icon {
    font-size: 2.2rem;
    color: #6366F1;
    filter: drop-shadow(0 2px 5px rgba(99, 102, 241, 0.3));
  }
  
  .footer-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #F8FAFC;
    letter-spacing: -0.02em;
  }
  
  .brand-tagline {
    font-size: 0.9rem;
    color: #A0AEC0;
    line-height: 1.4;
    margin-bottom: 0.7rem;
  }
  
  .footer-socials {
    display: flex;
    gap: 1.2rem;
  }
  
  .footer-socials a {
    color: #94A3B8;
    font-size: 1.3rem;
    transition: color 0.3s ease, transform 0.2s ease;
    padding: 0.2rem;
  }
  
  .footer-socials a:hover {
    color: #6366F1;
    transform: translateY(-3px);
  }
  
  .section-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #F8FAFC;
    margin-bottom: 1.2rem;
    position: relative;
    padding-bottom: 0.5rem;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background-color: #6366F1;
    border-radius: 2px;
  }
  
  .footer-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-links ul li {
    margin-bottom: 0.8rem;
  }
  
  .footer-links ul li a {
    color: #CBD5E1;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.3s ease;
  }
  
  .footer-links ul li a:hover {
    color: #6366F1;
    text-decoration: underline;
  }
  
  .footer-links ul li a i {
    color: #6366F1;
    margin-right: 0.6rem;
    font-size: 1.1rem;
    vertical-align: middle;
    transition: color 0.3s;
  }
  
  .footer-links ul li a:hover i {
    color: #3b82f6;
  }
  
  .footer-contact address {
    font-style: normal;
    margin: 0;
  }
  
  .footer-contact p {
    color: #CBD5E1;
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  
  .footer-contact p i {
    color: #6366F1;
    font-size: 1.1rem;
  }
  
  .footer-contact p a {
    color: #CBD5E1;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-contact p a:hover {
    color: #6366F1;
    text-decoration: underline;
  }
  
  .footer-bottom {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0.5rem 1rem 0.7rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    font-size: 0.82rem;
    color: #94A3B8;
  }
  
  .footer-copyright {
    margin-bottom: 0.2rem;
  }
  
  .footer-terms {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  
  .footer-terms a {
    color: #94A3B8;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-terms a:hover {
    color: #6366F1;
    text-decoration: underline;
  }
  
  .separator {
    color: #64748B;
  }
  
  @media (max-width: 768px) {
    .pro-footer {
      padding-top: 2rem;
    }
    .footer-container {
      flex-direction: column;
      padding: 0 1rem 2rem 1rem;
      gap: 2rem;
    }
    .footer-section {
      min-width: unset;
      width: 100%;
      text-align: center;
    }
    .footer-brand-info {
      flex: unset;
      min-width: unset;
    }
    .footer-brand, .footer-socials {
      justify-content: center;
    }
    .section-title {
      text-align: center;
      padding-bottom: 0.75rem;
    }
    .section-title::after {
      left: 50%;
      transform: translateX(-50%);
    }
    .footer-links ul {
      text-align: center;
    }
    .footer-contact p {
      justify-content: center;
    }
    .footer-bottom {
      padding: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .footer-title {
      font-size: 1.5rem;
    }
    .footer-logo-icon {
      font-size: 1.8rem;
    }
    .brand-tagline, .footer-links ul li a, .footer-contact p, .footer-bottom p, .footer-terms a {
      font-size: 0.85rem;
    }
    .footer-socials a {
      font-size: 1.1rem;
      gap: 1rem;
    }
  }
  </style>