import Img from '../img/img';

function Avatar(props) {

  return (
    <div className="avatar">
      <div className="w-14 rounded-full">
        <Img 
          src={props.src ? props.src : 'img/img/stock/mackenzie_day.png'}
          alt={props.alt ? props.alt : 'stock user photo'}
          height={props.height ? props.height : 48}
          width={props.width ? props.width : 48}
        />
      </div>
    </div>
  )
}

export default Avatar;
