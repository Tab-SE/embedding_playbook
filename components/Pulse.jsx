// eslint-disable-next-line no-unused-vars
import { tab_embed } from 'libs';
import { useTableauSession } from 'hooks';

export const Pulse = (props) => {
  const { src, height, width, disableExploreFilter } = props;

  // tanstack query hook to manage embed sessions
  const { status, data: jwt, error, isSuccess, isError, isLoading } = useTableauSession('a');

  if (isError) {
    console.debug(error);
  }

  return (
    <div className='flex justify-center rounded'>
      {isError ? <p>Authentication Error!</p> : null}
      {isLoading ? <p>Authenticating the User...</p> : null}
      {isSuccess ? 
        <tableau-pulse 
          id="tableauPulse"
          src={src}
          height={height}
          width={width}
          token={jwt}
          disableExploreFilter={disableExploreFilter}
        /> : null}
    </div>
  )
}
