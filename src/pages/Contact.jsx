const branches = [
  {
    id: 1,
    name: 'Фреша Южен парк',
    email: 'info@vitoFreshBar.bg',
    phone: '+359 897 873 676',
    address: 'бул. “Витоша” 137 (до входа на Южен Парк)',
    hours: 'Работно време: 9:00 – 19:30',
  },
  {
    id: 2,
    name: 'Фреша Цар Иван Асен',
    email: 'info@vitoFreshBar.bg',
    phone: '+359 899 133 996',
    address: 'ул. “Цар Иван Асен II” 54',
    hours: 'Работно време: 8:00 – 19:30',
  },
  {
    id: 3,
    name: 'Фреша Център',
    email: 'info@vitoFreshBar.bg',
    phone: '+359 897 222 727',
    address: 'бул. “Витоша” 17',
    hours: 'Работно време: 9:00 – 19:30',
  },
];

const Contact = () => (
  <section className="section contact-page">
    <div className="container">
      <header className="contact-header">
        <div>
          <p className="eyebrow">Контакти</p>
          <h2>Свържи се с нас</h2>
        </div>
        <p>
          Планираш кетъринг, имаш въпрос за сезонното меню или искаш да станеш партньор? Изпрати ни съобщение или посети един от нашите
          барове в София.
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
                  <span>Телефон:</span> <a href={`tel:${branch.phone.replace(/\\s+/g, '')}`}>{branch.phone}</a>
                </li>
                <li>
                  <span>Адрес:</span> {branch.address}
                </li>
                <li>
                  <span>{branch.hours}</span>
                </li>
              </ul>
            </article>
          ))}
        </div>

        <form
          className="contact-form"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
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
            <label>
              <input type="checkbox" required /> Приемам Декларация за защита на лични данни
            </label>
            <label>
              <input type="checkbox" /> Присъединявам се към маркетинг листа
            </label>
          </div>
          <button type="submit" className="btn btn-primary form-submit">
            Изпрати
          </button>
        </form>
      </div>

      <p className="contact-note">
        За препоръки или обратна връзка – сподели с нас на тел: <a href="tel:+359895525955">+359 895 525 955</a> или имейл:{' '}
        <a href="mailto:customer@vitoFreshBar.bg">customer@vitoFreshBar.bg</a>
      </p>

      <div className="contact-map">
        <iframe
          title="VitoFreshBar locations"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.512288075417!2d23.31924777671155!3d42.68828251557711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa857664c86151%3A0xef3d37c8a0c0c1a7!2sVitosha%20Blvd%2C%20Sofia!5e0!3m2!1sen!2sbg!4v1700000000000!5m2!1sen!2sbg"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </section>
);

export default Contact;
