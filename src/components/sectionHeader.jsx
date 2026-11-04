function SectionHeader({ index, title, id, children }) {
  return (
    <div className="section-head" data-reveal>
      <div>
        <span className="section-index mono">{index}</span>
        <h2 className="section-title" id={id}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export default SectionHeader;
