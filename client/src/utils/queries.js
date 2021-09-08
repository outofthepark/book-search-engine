import { gql } from '@apollo/client';

export const QUERY_GET_ME = gql`
  {
    me {
        _id
        username
        email
        savedBooks {
          bookId
          title
          author
          description
          image
          link
        }
      }
  }
`;