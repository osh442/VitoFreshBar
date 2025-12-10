const AdminSubmissions = () => {
  return (
    <div className="admin-card">
      <div className="admin-card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <p className="eyebrow">Контактна форма</p>
          <h2>Всички запитвания</h2>
          <p className="admin-subtitle">
            Онлайн формата е деактивирана и вече не записва данни в админ панела.
          </p>
        </div>
      </div>

      <p>
        За да проследявате клиентските въпроси, следете корпоративната поща и телефон. Всички нови
        заявки постъпват единствено през тези канали.
      </p>

      <ul className="contact-disabled-list">
        <li>
          <strong>Имейл:</strong> <a href="mailto:customer@vitoFreshBar.bg">customer@vitoFreshBar.bg</a>
        </li>
        <li>
          <strong>Телефон:</strong> <a href="tel:+359895525955">+359 895 525 955</a>
        </li>
      </ul>
    </div>
  );
};

export default AdminSubmissions;
