import { gql } from '@apollo/client';

const GET_EPISODES = gql`
  query GET_EPISODES {
    episodes {
      results {
        id
        name
        episode
        air_date
        characters {
          name
          image
          status
        }
      }
      info {
        next
        prev
      }
    }
  }
`;
export default GET_EPISODES;
