export default function Carousel(props) {
  return (
    <div className="carousel carousel-center max-w-5xl h-72 p-4 bg-stone-700 rounded-box">
      {Array.isArray(props.children) ? props.children.map((child, index) => {
        return (
          <div key={index} className={`carousel-item w-full`}>
            {child}
          </div>
        )
      }) : <></>}
    </div>
  );
}
