import { Link } from 'react-router-dom';

const HomeInfo = () => (
  <section className="home-hero" aria-labelledby="home-hero-title">
    <div className="container home-hero__content">
      <span className="home-hero__eyebrow">ЗДРАВОСЛОВНА ХРАНА</span>
      <h1 id="home-hero-title">Чиста енергия в чинията ти</h1>
      <p className="home-hero__lead">
        Подбрани здравословни продукти, без излишна захар и боклуци – за хора, които искат да се чувстват леки, фокусирани и в контрол. От ежедневни хранения до smart snacks – всичко е подготвено така, че само да избереш и да поръчаш.
      </p>
      <div className="home-hero__actions">
        <Link className=" btn btn-primary home-hero__cta" to="/menu">
          Поръчай сега
        </Link>
        <Link className="btn btn-outline" to="/about">
          Научи повече
        </Link>
      </div>
    </div>
  </section>
);

export default HomeInfo;
