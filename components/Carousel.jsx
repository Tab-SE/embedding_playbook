export default function Carousel(props) {
  console.log(props.children);

  return (
    <div className="carousel carousel-center max-w-3xl h-72 p-4 bg-stone-700 rounded-box">
      {props.children.map((child, index) => {
        return (
          <div className={`carousel-item ${index !== 0 ? 'mx-4' : ''}`}>
            {child}
          </div>
        )
      })}
    </div>
  );
}
