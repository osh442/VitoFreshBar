const CategoryCard = ({ title, description, icon, href }) => (
  <a className="category-card" href={href} target="_blank" rel="noreferrer">
    <div className="category-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </a>
);

export default CategoryCard;
