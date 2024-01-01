export default function Carousel(props) {
  return (
    <div className="carousel carousel-center max-w-3xl h-72 p-4 bg-stone-700 rounded-box">
      {Array.isArray(props.children) ? props.children.map((child, index) => {
        return (
          <div key={index} className={`carousel-item ${index !== 0 ? 'mx-4' : ''}`}>
            {child}
          </div>
        )
      }) : <></>}
    </div>
  );
}
