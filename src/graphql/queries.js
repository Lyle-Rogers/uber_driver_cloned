export const getCarId = /* GraphQL */ `
  query GetCar($id: ID!) {
    getCar(id: $id) {
      id
    }
  }
`;

export const getCar = /* GraphQL */ `
  query GetCar($id: ID!) {
    getCar(id: $id) {
      id
      type
      latitude
      longitude
      heading
      isActive
      userId
      user {
        id
        username
        email
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
    }
  }
`;

export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        type
        status
        originLatitude
        originLongitude
        destinationLatitude
        destinationLongitude
        userId
        user {
          id
          username
          email
          carId
          createdAt
          updatedAt
          owner
        }
        carId
        car {
          id
          type
          latitude
          longitude
          heading
          isActive
          userId
          createdAt
          updatedAt
          owner
        }
        updatedAt
        userOrdersId
        carOrdersId
        owner
      }
      nextToken
    }
  }
`;
