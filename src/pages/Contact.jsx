import { useEffect, useRef, useState } from 'react';

const branches = [
  {
    id: 1,
    name: 'VitoFresh Bar Витоша',
    email: 'info@vitoFreshBar.bg',
    phone: '+359 897 873 676',
    address: 'бул. Витоша 137 (до входа на Paradise Center)',
    hours: 'Понеделник – Неделя: 9:00 – 19:30',
  },
  {
    id: 2,
    name: 'VitoFresh Bar Сердика',
    email: 'info@vitoFreshBar.bg',
    phone: '+359 899 133 996',
    address: 'ул. Черни връх 54, Сердика Център – ниво II',
    hours: 'Понеделник – Неделя: 8:00 – 19:30',
  },
  {
    id: 3,
    name: 'VitoFresh Bar Младост',
    email: 'info@vitoFreshBar.bg',
    phone: '+359 897 222 727',
    address: 'ул. Александър Малинов 17 (до метростанция Младост 1)',
    hours: 'Понеделник – Неделя: 9:00 – 19:30',
  },
];

const ContactMap = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    if (isMapVisible) return;
    if (typeof window === 'undefined') {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsMapVisible(true);
      return;
    }

    const element = placeholderRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMapVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isMapVisible]);

  return (
    <div className="contact-map">
      {isMapVisible ? (
        <iframe
          title="Локации на VitoFresh Bar"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.512288075417!2d23.31924777671155!3d42.68828251557711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa857664c86151%3A0xef3d37c8a0c0c1a7!2sVitosha%20Blvd%2C%20Sofia!5e0!3m2!1sen!2sbg!4v1700000000000!5m2!1sen!2sbg"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-placeholder" ref={placeholderRef}>
          <p>Картата на Google се зарежда само при нужда, за да избегнем предупреждения в конзолата.</p>
          <button type="button" className="btn btn-primary" onClick={() => setIsMapVisible(true)}>
            Показване на картата
          </button>
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  return (
    <section className="section contact-page">
      <div className="container">
        <header className="contact-header">
          <div>
            <h1 className="eyebrow">Свържете се с нас</h1>
            <h2>Готови сме да ви изслушаме</h2>
          </div>
          <p>
            Пишете ни, ако имате нужда от индивидуална оферта, обратна връзка за вкусовете ни или
            идеи за събитие. Екипът на VitoFresh Bar отговаря бързо и внимателно, за да получите
            най-доброто преживяване независимо дали поръчвате онлайн или посещавате физическите ни
            обекти.
          </p>
        </header>

        <div className="contact-layout">
          <div className="branches-panel">
            {branches.map((branch) => (
              <article key={branch.id} className="branch-card">
                <h3>{branch.name}</h3>
                <ul className="contact-list">
                  <li>
                    <span>Имейл:</span> <a href={`mailto:${branch.email}`}>{branch.email}</a>
                  </li>
                  <li>
                    <span>Телефон:</span>{' '}
                    <a href={`tel:${branch.phone.replace(/\s+/g, '')}`}>{branch.phone}</a>
                  </li>
                  <li>
                    <span>Адрес:</span> {branch.address}
                  </li>
                  <li>
                    <span>Работно време:</span> {branch.hours}
                  </li>
                </ul>
              </article>
            ))}
          </div>

          <div className="contact-form contact-form-disabled">
            <h3>Онлайн формата е временно деактивирана</h3>
            <p>
              За да получим вашето запитване, използвайте директните ни канали за връзка. Така
              гарантираме, че съобщенията достигат до екипа веднага, без да се съхраняват в админ
              панела.
            </p>
            <ul className="contact-disabled-list">
              <li>
                <strong>Телефон:</strong> <a href="tel:+359895525955">+359 895 525 955</a>
              </li>
              <li>
                <strong>Имейл:</strong>{' '}
                <a href="mailto:customer@vitoFreshBar.bg">customer@vitoFreshBar.bg</a>
              </li>
              <li>
                <strong>Messenger:</strong>{' '}
                <a href="https://m.me/vitofreshbar" target="_blank" rel="noreferrer">
                  m.me/vitofreshbar
                </a>
              </li>
            </ul>
            <p className="contact-disabled-note">
              Благодарим за разбирането – работим по нов дигитален канал, а дотогава приемаме всички
              заявки лично.
            </p>
          </div>
        </div>

        <p className="contact-note">
          Нуждаете се от спешен отговор? Обадете се на{' '}
          <a href="tel:+359895525955">+359 895 525 955</a> или ни пишете на{' '}
          <a href="mailto:customer@vitoFreshBar.bg">customer@vitoFreshBar.bg</a>. Ще се свържем с
          вас в рамките на един работен ден.
        </p>

        <ContactMap />
      </div>
    </section>
  );
};

export default Contact;
