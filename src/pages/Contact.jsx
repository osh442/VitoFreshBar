import { useState } from 'react';

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

const STORAGE_KEY = 'contactSubmissions';

const Contact = () => {
  const [consents, setConsents] = useState({
    declaration: false,
    marketing: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleConsent = (key) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSubmission = (payload) => {
    if (typeof window === 'undefined') return;
    try {
      const existing = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
      const next = [payload, ...existing].slice(0, 50);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('contactSubmissionsUpdated'));
    } catch (error) {
      console.error('Unable to persist contact submission', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(false);

    if (!consents.declaration) {
      alert('Моля, потвърдете декларацията за защита на личните данни.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submission = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      message: formData.get('message'),
      acceptDeclaration: consents.declaration,
      marketingOptIn: consents.marketing,
    };

    saveSubmission(submission);
    event.currentTarget.reset();
    setConsents({ declaration: false, marketing: false });
    setSubmitted(true);
  };

  return (
    <section className="section contact-page">
      <div className="container">
        <header className="contact-header">
          <div>
            <p className="eyebrow">Свържете се с нас</p>
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

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Име*
                <input name="firstName" required />
              </label>
              <label>
                Фамилия*
                <input name="lastName" required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Имейл*
                <input type="email" name="email" required />
              </label>
              <label>
                Телефон
                <input name="phone" />
              </label>
            </div>
            <label>
              Съобщение*
              <textarea name="message" rows={5} required />
            </label>
            <div className="contact-checkboxes">
              <button
                type="button"
                className={`consent-chip ${consents.declaration ? 'active' : ''}`}
                onClick={() => toggleConsent('declaration')}
                aria-pressed={consents.declaration}
              >
                <span className="consent-chip-icon" aria-hidden="true">
                  <span className="consent-chip-spark" />
                </span>
                <span className="consent-chip-text">Приемам Декларация за защита на лични данни</span>
              </button>
              <button
                type="button"
                className={`consent-chip ${consents.marketing ? 'active' : ''}`}
                onClick={() => toggleConsent('marketing')}
                aria-pressed={consents.marketing}
              >
                <span className="consent-chip-icon" aria-hidden="true">
                  <span className="consent-chip-spark" />
                </span>
                <span className="consent-chip-text">Присъединявам се към маркетинг листа</span>
              </button>
            </div>
            <input type="hidden" name="acceptDeclaration" value={consents.declaration ? 'yes' : 'no'} />
            <input type="hidden" name="marketingOptIn" value={consents.marketing ? 'yes' : 'no'} />
            <button type="submit" className="btn btn-primary form-submit">
              Изпрати
            </button>
            {submitted && (
              <p className="form-success" role="status">
                Благодарим! Съобщението е изпратено успешно.
              </p>
            )}
          </form>
        </div>

        <p className="contact-note">
          Нуждаете се от спешен отговор? Обадете се на{' '}
          <a href="tel:+359895525955">+359 895 525 955</a> или ни пишете на{' '}
          <a href="mailto:customer@vitoFreshBar.bg">customer@vitoFreshBar.bg</a>. Ще се свържем с
          вас в рамките на един работен ден.
        </p>

        <div className="contact-map">
          <iframe
            title="Локации на VitoFresh Bar"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.512288075417!2d23.31924777671155!3d42.68828251557711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa857664c86151%3A0xef3d37c8a0c0c1a7!2sVitosha%20Blvd%2C%20Sofia!5e0!3m2!1sen!2sbg!4v1700000000000!5m2!1sen!2sbg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
