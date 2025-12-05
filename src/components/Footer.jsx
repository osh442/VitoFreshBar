import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div>
        <h3 className="footer-logo">VitoFreshBar</h3>
        <p>Juice Bar and Healthy Food</p>
        <div className="footer-social">
          <a href="https://facebook.com" aria-label="Facebook">
            f
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            ig
          </a>
          <a href="https://tiktok.com" aria-label="TikTok">
            tt
          </a>
        </div>
      </div>

      <div>
        <h4>Магазин</h4>
        <Link to="/about">За нас</Link>
        <Link to="/promotion">Промоции</Link>
        <Link to="/contact">Контакти</Link>
      </div>

      <div>
        <h4>Информация</h4>
        <p>Начини на доставка</p>
        <p>Методи на плащане</p>
        <p>Общи условия</p>
        <p>Политика за поверителност</p>
      </div>

      <div>
        <h4>За връзка с нас</h4>
        <p>
          <strong>Фреша Център:</strong> бул. „Витоша“ 4
          <br />
          <strong>Фреша Южен парк:</strong> бул. „Витоша“ 139
        </p>
        <p>
          <strong>Имейл:</strong> info@fresha.bg
        </p>
        <div className="footer-payments">
          <a
            href="https://www.mastercard.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Mastercard"
            className="payment-icon payment-mastercard"
          />
          <a
            href="https://www.visa.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Visa"
            className="payment-icon payment-visa"
          />
          
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Fresha. Всички права запазени.</p>
     
    </div>
  </footer>
);

export default Footer;
