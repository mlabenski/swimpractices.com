exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);
  const uuid = Math.floor(Math.random() * 9999999)

  console.log('does this work?')
  console.log(user)

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ['free']
      },
      user_metadata: {
        ...user.user_metadata,
        uuid
      }
    }),
  };
};
