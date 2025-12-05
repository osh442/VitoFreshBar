const promos = [
  {
    id: 'weekend-brunch',
    title: 'Weekend Brunch Pack',
    description: '2 брънч менюта + 2 напитки по избор за 32 лв.',
  },
  {
    id: 'smoothie-club',
    title: 'Smoothie Club',
    description: 'Всеки четвърти смути е подарък при поръчка през приложението.',
  },
  {
    id: 'office-catering',
    title: 'Office Daily',
    description: '15% отстъпка за предварителни корпоративни заявки.',
  },
];

const Promotion = () => (
  <section className="section">
    <div className="container">
      <p className="eyebrow">Промоции</p>
      <h2>Сезонни предложения</h2>
      <div className="promo-grid">
        {promos.map((promo) => (
          <article key={promo.id} className="promo-card">
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
            <button type="button" className="btn btn-outline">
              Виж детайли
            </button>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Promotion;
